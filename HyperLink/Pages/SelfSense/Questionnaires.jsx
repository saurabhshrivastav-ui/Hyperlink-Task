import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
  Dimensions,
  Image,
  ImageBackground, // Required for the header image
  Easing,
  StatusBar,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
// Assuming TextWrapper exists
import { Text } from "../../Components/TextWrapper";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// --- TONE GENERATOR ---
// Generates a WAV sine wave as a base64 data URI
const generateToneBase64 = (frequency, durationSec = 2, sampleRate = 44100) => {
  const numSamples = Math.floor(sampleRate * durationSec);
  const amplitude = 0.5; // 50% volume to avoid clipping
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = numSamples * blockAlign;
  const fileSize = 44 + dataSize;

  // Create buffer
  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  // Helper to write string
  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // WAV Header
  writeString(0, "RIFF");
  view.setUint32(4, fileSize - 8, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  // Generate sine wave samples with fade in/out to avoid clicks
  const fadeFrames = Math.min(Math.floor(sampleRate * 0.05), numSamples / 2); // 50ms fade
  for (let i = 0; i < numSamples; i++) {
    let sample = Math.sin((2 * Math.PI * frequency * i) / sampleRate) * amplitude;
    // Fade in
    if (i < fadeFrames) sample *= i / fadeFrames;
    // Fade out
    if (i > numSamples - fadeFrames) sample *= (numSamples - i) / fadeFrames;
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(44 + i * 2, intSample, true);
  }

  // Convert to base64
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Pre-generate tones for each frequency
const TONE_CACHE = {};
const getToneUri = (frequency) => {
  if (!TONE_CACHE[frequency]) {
    TONE_CACHE[frequency] = `data:audio/wav;base64,${generateToneBase64(frequency, 3)}`;
  }
  return TONE_CACHE[frequency];
};

// --- 1. SUPPLEMENTARY DISPLAY DATA ---
const CONDITION_DESCRIPTIONS = {
  "diabetes_pre-diabetes":
    "Assess risks for Diabetes, BP, Thyroid, and heart health.",
  hypertension: "Regular checks help prevent heart disease.",
  obesity: "Weight management reduces long-term health risks.",
  pcod_pcos: "Early diagnosis helps management of hormone levels.",
  breast_cancer: "Guidance on self-checks for breast, oral, and lung health.",
  cervical_cancer: "Regular screening is crucial for early detection.",
  oral_cancer: "Early detection of sores improves outcomes.",
  prostate_cancer: "Screening is important for men over 50.",
  colonrectal_cancer: "Monitor bowel habits and screen regularly.",
  stress: "Track stress, anxiety levels, and burnout symptoms.",
  anxiety: "Anxiety is manageable with support and therapy.",
  sleep: "Quality sleep is essential for immune function.",
  burnout: "Rest and boundaries are necessary.",
  mood: "Tracking mood helps identify patterns.",
  focus: "Limit distractions to improve productivity.",
  vision: "Regular eye exams prevent strain.",
  hearing: "Check for hearing loss, tinnitus, and eye strain.",
  tinnitus: "Manage stress to reduce ringing impact.",
  smell: "Loss of smell can indicate sinus issues.",
  taste: "Taste changes can be linked to nutrition.",
  touch: "Numbness should be evaluated.",
};

const HEALTH_DATA = {
  health_assessments: [
    // --- CHRONIC CONDITIONS ---
    {
      category: "Chronic Condition",
      conditions: [
        {
          id: "diabetes_pre-diabetes",
          name: "Diabetes & Pre Diabetes",
          image: require("../../assets/SelfSenseDiabetes.webp"),

          risk_copy: {
            low: {
              label: "LOW RISK",
              range: "Low cumulative risk score",
              result_content: "Annual screening recommended",
            },

            moderate: {
              label: "MODERATE RISK",
              range: "Moderate cumulative risk score",
              result_content:
                "Blood sugar testing every 6 months + lifestyle modification",
            },

            high: {
              label: "HIGH RISK",
              range: "High cumulative risk score",
              result_content:
                "Immediate fasting glucose / HbA1c testing + intensive lifestyle intervention",
            },
          },

          questions: [
            {
              id: 1,
              question_text: "Body Mass Index (BMI)",
              options: [
                { text: "Normal", score: 0 },
                { text: "Overweight", score: 5 },
                { text: "Obese", score: 10 },
              ],
            },
            {
              id: 2,
              question_text: "Waist Circumference",
              options: [
                { text: "Normal", score: 0 },
                { text: "Increased", score: 7 },
              ],
            },
            {
              id: 3,
              question_text: "Physical Activity Level",
              options: [
                { text: "> 30 minutes daily", score: 0 },
                { text: "< 30 minutes daily", score: 5 },
                { text: "Sedentary (little to no activity)", score: 10 },
              ],
            },
            {
              id: 4,
              question_text: "Family History of Diabetes",
              options: [
                { text: "None", score: 0 },
                { text: "One parent", score: 5 },
                { text: "Both parents", score: 10 },
              ],
            },
            {
              id: 5,
              question_text:
                "Have you ever been told you have high blood sugar or prediabetes?",
              options: [
                { text: "Yes", score: 10 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 6,
              question_text: "Do you have high blood pressure?",
              options: [
                { text: "Yes", score: 7 },
                { text: "No", score: 0 },
                { text: "Don't know", score: 3 },
              ],
            },
            {
              id: 7,
              question_text: "Diet Pattern",
              options: [
                { text: "Balanced diet", score: 0 },
                { text: "High refined carbs / sugary foods", score: 7 },
              ],
            },
            {
              id: 8,
              question_text: "History of Gestational Diabetes (for women only)",
              options: [
                { text: "Yes", score: 10 },
                { text: "No", score: 0 },
                { text: "Not applicable", score: 0 },
              ],
            },
            {
              id: 9,
              question_text:
                "Do you experience frequent thirst or excessive urination?",
              options: [
                { text: "Yes", score: 10 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 10,
              question_text: "Do you feel persistent or unexplained fatigue?",
              options: [
                { text: "Yes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 11,
              question_text:
                "Have you noticed unexplained weight loss or weight gain?",
              options: [
                { text: "Yes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 12,
              question_text: "Alcohol Consumption",
              options: [
                { text: "None", score: 0 },
                { text: "Occasional", score: 3 },
                { text: "Regular", score: 7 },
              ],
            },
            {
              id: 13,
              question_text: "Do you smoke or use tobacco products?",
              options: [
                { text: "Yes", score: 7 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "hypertension",
          name: "Hypertension",
          image: require("../../assets/SelfSenseHyperTension.webp"),
          risk_copy: {
            low: {
              label: "LOW RISK",
              range: "Low cumulative risk score",
              result_content:
                "Estimated less than 10% risk over the next 10 years. Continue healthy lifestyle practices and routine blood pressure monitoring.",
            },

            moderate: {
              label: "MODERATE RISK",
              range: "Moderate cumulative risk score",
              result_content:
                "Approximately 4× higher odds of developing hypertension. Lifestyle modification and periodic blood pressure checks are strongly recommended.",
            },

            high: {
              label: "HIGH RISK",
              range: "High cumulative risk score",
              result_content:
                "Approximately 11× higher risk of hypertension. A physician evaluation is advised within the next 7–10 days for further assessment and management.",
            },
          },

          questions: [
            {
              id: 1,
              question_text: "Body Mass Index (BMI)",
              options: [
                { text: "Normal", score: 0 },
                { text: "Overweight", score: 5 },
                { text: "Obese", score: 10 },
              ],
            },

            {
              id: 2,
              question_text: "Waist circumference",
              options: [
                { text: "Normal", score: 0 },
                { text: "Increased", score: 7 },
              ],
            },

            {
              id: 3,
              question_text: "Family history of hypertension",
              options: [
                { text: "Yes", score: 7 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 4,
              question_text: "Do you have diabetes or pre-diabetes?",
              options: [
                { text: "Yes", score: 10 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 5,
              question_text: "Known cholesterol abnormality",
              options: [
                { text: "Yes", score: 7 },
                { text: "No", score: 0 },
                { text: "Don't know", score: 3 },
              ],
            },

            {
              id: 6,
              question_text: "Salt consumption",
              options: [
                { text: "Low", score: 0 },
                { text: "Moderate", score: 3 },
                { text: "High", score: 7 },
              ],
            },

            {
              id: 7,
              question_text: "Physical activity",
              options: [
                { text: "Regular", score: 0 },
                { text: "Occasional", score: 5 },
                { text: "None", score: 10 },
              ],
            },

            {
              id: 8,
              question_text: "Alcohol intake",
              options: [
                { text: "None", score: 0 },
                { text: "Occasional", score: 3 },
                { text: "Regular", score: 7 },
              ],
            },

            {
              id: 9,
              question_text: "Smoking history",
              options: [
                { text: "Yes", score: 7 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 10,
              question_text: "History of cardiovascular disease",
              options: [
                { text: "Yes", score: 10 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 11,
              question_text: "Known systolic blood pressure",
              options: [
                { text: "Normal", score: 0 },
                { text: "Borderline", score: 5 },
                { text: "High", score: 10 },
                { text: "Not checked", score: 3 },
              ],
            },
          ],
        },
        {
          id: "obesity",
          name: "Obesity",
          image: require("../../assets/SelfSenseObesity.webp"),

          risk_copy: {
            category_1: {
              label: "CATEGORY 1 – PREVENTION FOCUS",
              range: "BMI < 25",
              result_content:
                "Your BMI is within the healthy range. Focus on prevention by maintaining balanced nutrition, regular physical activity, adequate sleep, and periodic health monitoring to sustain long-term metabolic well-being.",
            },

            category_2: {
              label: "CATEGORY 2 – INTENSIVE LIFESTYLE INTERVENTION",
              range: "BMI 25 – 29.9",
              result_content:
                "Your BMI falls in the overweight range. Intensive lifestyle intervention is recommended, including structured dietary planning, increased physical activity, portion control, and behavior modification to prevent progression to obesity and related health conditions.",
            },

            category_3: {
              label: "CATEGORY 3 – STRUCTURED WEIGHT MANAGEMENT PROGRAM",
              range: "BMI ≥ 30",
              result_content:
                "Your BMI indicates obesity. Enrollment in a structured weight management program is strongly advised, involving personalized nutrition guidance, physical activity planning, behavioral therapy, and regular progress tracking.",
            },

            category_4: {
              label: "CATEGORY 4 – MEDICAL INTERVENTION ADVISED",
              range: "BMI ≥ 30 with comorbidities",
              result_content:
                "Your BMI combined with obesity-related comorbidities (such as diabetes, hypertension, or dyslipidemia) suggests the need for medical intervention. Physician-guided management, including pharmacotherapy and closer clinical monitoring, may be required.",
            },

            category_5: {
              label: "CATEGORY 5 – MULTIDISCIPLINARY TREATMENT",
              range: "BMI ≥ 40",
              result_content:
                "Your BMI indicates severe obesity. A comprehensive, multidisciplinary treatment approach is recommended, involving medical specialists, dietitians, behavioral health professionals, and consideration of advanced interventions to achieve sustainable and safe weight reduction.",
            },
          },

          questions: [
            {
              id: 1,
              question_text: "Current Body Mass Index (BMI)",
              options: [
                { text: "< 25", score: 0 },
                { text: "25 – 29.9", score: 5 },
                { text: "≥ 30", score: 10 },
              ],
            },
            {
              id: 2,
              question_text: "Progressive weight gain in the last 1 year",
              options: [
                { text: "Yes", score: 7 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Eating pattern",
              options: [
                { text: "Regular", score: 0 },
                { text: "Irregular", score: 5 },
              ],
            },
            {
              id: 4,
              question_text: "Processed food / sugar intake",
              options: [
                { text: "Low", score: 0 },
                { text: "Moderate", score: 3 },
                { text: "High", score: 7 },
              ],
            },
            {
              id: 5,
              question_text: "Portion control",
              options: [
                { text: "Good", score: 0 },
                { text: "Poor", score: 7 },
              ],
            },
            {
              id: 6,
              question_text: "Physical activity level",
              options: [
                { text: "Regular", score: 0 },
                { text: "Occasional", score: 5 },
                { text: "None", score: 10 },
              ],
            },
            {
              id: 7,
              question_text:
                "Do you have weight-related conditions such as high blood pressure or diabetes?",
              options: [
                { text: "Yes", score: 10 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 8,
              question_text: "Previous weight-loss attempts",
              options: [
                { text: "Yes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 9,
              question_text:
                "Do you experience emotional or stress-related eating?",
              options: [
                { text: "Yes", score: 7 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 10,
              question_text: "Your confidence in losing weight",
              options: [
                { text: "High", score: 0 },
                { text: "Moderate", score: 3 },
                { text: "Low", score: 7 },
              ],
            },
            {
              id: 11,
              question_text:
                "Impact of weight on your quality of life (mobility, energy, self-confidence)",
              options: [
                { text: "Minimal", score: 0 },
                { text: "Moderate", score: 5 },
                { text: "Severe", score: 10 },
              ],
            },
            {
              id: 12,
              question_text:
                "Do you believe your health and quality of life will improve with weight loss?",
              options: [
                { text: "Yes", score: 0 },
                { text: "No", score: 5 },
              ],
            },
            {
              id: 13,
              question_text: "Readiness for lifestyle change",
              options: [
                { text: "Ready", score: 0 },
                { text: "Unsure", score: 3 },
                { text: "Not ready", score: 7 },
              ],
            },
          ],
        },

        {
          id: "pcod_pcos",
          name: "PCOD / PCOS",
          image: require("../../assets/SelfSensePCOD.webp"),

          risk_copy: {
            low: {
              label: "LOW RISK",
              range: "Low cumulative risk score",
              result_content:
                "Your responses suggest a low risk for PCOD/PCOS at present. Continue routine annual monitoring and maintain a balanced lifestyle to support hormonal health.",
            },

            moderate: {
              label: "MODERATE RISK",
              range: "Moderate cumulative risk score",
              result_content:
                "Your responses indicate moderate risk features suggestive of PCOD/PCOS. A gynecological or endocrine evaluation is recommended within the next 3 months for further assessment and guidance.",
            },

            high: {
              label: "HIGH RISK",
              range: "High cumulative risk score",
              result_content:
                "Your responses indicate a high likelihood of PCOD/PCOS. An urgent pelvic ultrasound and hormonal evaluation are advised within the next 1 week to confirm diagnosis and initiate appropriate management.",
            },
          },
          questions: [
            {
              id: 1,
              question_text: "Menstrual cycle regularity",
              options: [
                { text: "Regular", score: 0 },
                { text: "Irregular", score: 10 },
              ],
            },

            {
              id: 2,
              question_text: "Typical cycle length",
              options: [
                { text: "< 35 days", score: 0 },
                { text: "≥ 35 days", score: 7 },
              ],
            },

            {
              id: 3,
              question_text: "Heavy menstrual bleeding",
              options: [
                { text: "Yes", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 4,
              question_text: "Excess facial or body hair (hirsutism)",
              options: [
                { text: "Yes", score: 10 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 5,
              question_text: "Hair thinning or scalp hair loss",
              options: [
                { text: "Yes", score: 7 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 6,
              question_text: "Moderate to severe acne",
              options: [
                { text: "Yes", score: 7 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 7,
              question_text: "Darkened skin patches (acanthosis nigricans)",
              options: [
                { text: "Yes", score: 10 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 8,
              question_text: "Body Mass Index (BMI)",
              options: [
                { text: "Normal", score: 0 },
                { text: "Overweight", score: 5 },
                { text: "Obese", score: 10 },
              ],
            },

            {
              id: 9,
              question_text: "Weight gain mainly around the abdomen",
              options: [
                { text: "Yes", score: 7 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 10,
              question_text: "Difficulty conceiving",
              options: [
                { text: "Yes", score: 10 },
                { text: "No", score: 0 },
                { text: "Not applicable", score: 0 },
              ],
            },

            {
              id: 11,
              question_text: "Family history of PCOS",
              options: [
                { text: "Yes", score: 7 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 12,
              question_text: "Known insulin resistance",
              options: [
                { text: "Yes", score: 10 },
                { text: "No", score: 0 },
                { text: "Don't know", score: 5 },
              ],
            },

            {
              id: 13,
              question_text: "Mood swings or anxiety",
              options: [
                { text: "Yes", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 14,
              question_text: "Previous diagnosis of PCOS",
              options: [
                { text: "Yes", score: 15 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
      ],
    },

    // --- CANCER AWARENESS ---
    {
      category: "Cancer Awareness",
      conditions: [
        {
          id: "breast_cancer",
          name: "Breast Cancer",
          image: require("../../assets/SelfSenseBreastCancer.webp"),

          risk_copy: {
            low: {
              label: "LOW RISK",
              range: "0–3 positive responses",
              result_content:
                "Based on your responses, you currently show minimal concerning signs. Continue monthly breast self-awareness and annual clinical breast examination from age 40 (or earlier if there is a family history).",
            },

            moderate: {
              label: "MODERATE RISK",
              range: "4–7 positive responses",
              result_content:
                "Your responses indicate some concerning changes. Please schedule a clinical breast examination within the next 2 weeks. Diagnostic imaging may be advised based on clinical findings.",
            },

            high: {
              label: "HIGH RISK",
              range: "8 or more positive responses",
              result_content:
                "Your responses indicate multiple concerning signs requiring immediate medical attention. Please consult a breast specialist within the next 7 days. Early detection is associated with greater than 95% survival.",
            },
          },

          questions: [
            {
              id: 1,
              question_text:
                "Have you noticed a new lump or thickening in your breast or armpit in the past month?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Unsure", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 2,
              question_text:
                "Have you observed any change in the size or shape of your breast?",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 3,
              question_text:
                "Have you noticed skin dimpling, puckering, or an orange-peel appearance?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Unsure", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 4,
              question_text:
                "Have you noticed any change in nipple position, inversion, or direction?",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 5,
              question_text:
                "Do you have any nipple discharge when not breastfeeding?",
              options: [
                { text: "No", score: 0 },
                { text: "Yes – clear", score: 3 },
                { text: "Yes – other", score: 5 },
                { text: "Yes – bloody", score: 10 },
              ],
            },

            {
              id: 6,
              question_text:
                "Have you experienced redness, scaling, or rash on the breast or nipple?",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 7,
              question_text:
                "Do you experience persistent pain in the breast or armpit?",
              options: [
                { text: "Yes", score: 5 },
                { text: "Unsure", score: 2 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 8,
              question_text:
                "Have you noticed swelling of part or all of the breast without a distinct lump?",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 9,
              question_text:
                "Do both breasts look symmetrical when you raise your arms?",
              options: [
                { text: "Yes", score: 0 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 7 },
              ],
            },

            {
              id: 10,
              question_text:
                "Do you have a first-degree relative (mother, sister, daughter) with breast cancer?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Don't know", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 11,
              question_text: "Age at first menstruation",
              options: [
                { text: "Before 12", score: 5 },
                { text: "12 – 14", score: 2 },
                { text: "After 14", score: 0 },
                { text: "Don't remember", score: 2 },
              ],
            },

            {
              id: 12,
              question_text:
                "Have you ever had a breast biopsy or breast abnormality diagnosed before?",
              options: [
                { text: "Yes", score: 7 },
                { text: "Don't know", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 13,
              question_text:
                "Do you consume alcohol regularly (more than 1 drink per day)?",
              options: [
                { text: "Yes", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 14,
              question_text:
                "How often do you perform breast self-awareness checks?",
              options: [
                { text: "Monthly", score: 0 },
                { text: "Occasionally", score: 3 },
                { text: "Rarely", score: 5 },
                { text: "Never", score: 7 },
              ],
            },
          ],
        },
        {
          id: "cervical_cancer",
          name: "Cervical Cancer",
          image: require("../../assets/SelfSenseCervicalCancer.webp"),

          risk_copy: {
            low: {
              label: "LOW RISK",
              range: "0–3 positive responses",
              result_content:
                "Low immediate concern. Maintain routine cervical screening as per age recommendations. HPV testing every 5 years or Pap test every 3 years is advised.",
            },

            moderate: {
              label: "MODERATE RISK",
              range: "4–6 positive responses",
              result_content:
                "Risk factors are present. Please schedule a cervical screening examination within the next 4–6 weeks for further evaluation.",
            },

            high: {
              label: "HIGH RISK",
              range: "7 or more positive responses",
              result_content:
                "Concerning symptoms have been detected. Consult a gynecologist within the next 1–2 weeks for prompt assessment. Early detection is associated with approximately 92% survival.",
            },
          },

          questions: [
            {
              id: 1,
              question_text: "When was your last Pap smear or HPV test?",
              options: [
                { text: "Less than 3 years", score: 0 },
                { text: "3–5 years", score: 3 },
                { text: "More than 5 years", score: 7 },
                { text: "Never", score: 10 },
                { text: "Don't remember", score: 5 },
              ],
            },

            {
              id: 2,
              question_text: "Have you experienced abnormal vaginal bleeding?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Unsure", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 3,
              question_text:
                "Do you have unusual vaginal discharge (foul-smelling, watery, or blood-tinged)?",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 4,
              question_text:
                "Have you experienced pelvic pain not related to menstruation?",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 5,
              question_text:
                "Do you experience pain or bleeding during or after sexual intercourse?",
              options: [
                { text: "Yes", score: 10 },
                { text: "No", score: 0 },
                { text: "Not applicable", score: 0 },
              ],
            },

            {
              id: 6,
              question_text: "Age at first sexual intercourse",
              options: [
                { text: "Before 18", score: 7 },
                { text: "18–21", score: 3 },
                { text: "After 21", score: 0 },
                { text: "Not applicable", score: 0 },
              ],
            },

            {
              id: 7,
              question_text:
                "Have you had more than 3 lifetime sexual partners?",
              options: [
                { text: "Yes", score: 7 },
                { text: "No", score: 0 },
                { text: "Prefer not to answer", score: 3 },
              ],
            },

            {
              id: 8,
              question_text: "Do you or your partner smoke?",
              options: [
                { text: "Yes", score: 7 },
                { text: "Don't know", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 9,
              question_text: "Do you know your HPV status?",
              options: [
                { text: "Positive", score: 10 },
                { text: "Negative", score: 0 },
                { text: "Never tested", score: 5 },
                { text: "Don't know", score: 3 },
              ],
            },

            {
              id: 10,
              question_text: "Have you received the HPV vaccine?",
              options: [
                { text: "Yes, complete", score: 0 },
                { text: "Partial", score: 3 },
                { text: "No", score: 7 },
                { text: "Don't know", score: 3 },
              ],
            },

            {
              id: 11,
              question_text: "Do you have a weakened immune system?",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 12,
              question_text: "Have you had 3 or more full-term pregnancies?",
              options: [
                { text: "Yes", score: 5 },
                { text: "No", score: 0 },
                { text: "Not applicable", score: 0 },
              ],
            },

            {
              id: 13,
              question_text:
                "Have you used oral contraceptive pills for more than 5 years?",
              options: [
                { text: "Yes", score: 5 },
                { text: "No", score: 0 },
                { text: "Not applicable", score: 0 },
              ],
            },
          ],
        },
        {
          id: "oral_cancer",
          name: "Oral Cancer",
          image: require("../../assets/SelfSenseOralCancer.webp"),

          risk_copy: {
            low: {
              label: "LOW RISK",
              range: "0–3 positive responses",
              result_content:
                "No immediate concern. Continue maintaining good oral hygiene and perform monthly oral self-examinations to monitor for any new changes.",
            },

            moderate: {
              label: "MODERATE RISK",
              range: "4–6 positive responses",
              result_content:
                "Oral lesions or symptoms require evaluation. Please visit a dentist or ENT specialist within the next 2–3 weeks for further assessment.",
            },

            high: {
              label: "HIGH RISK",
              range: "7 or more positive responses",
              result_content:
                "Urgent evaluation is required. Please consult an oral cancer specialist or ENT surgeon within the next 7 days. Early detection is associated with approximately 84% survival.",
            },
          },

          questions: [
            {
              id: 1,
              question_text: "Do you use tobacco in any form?",
              options: [
                { text: "Yes, daily", score: 10 },
                { text: "Yes, occasionally", score: 5 },
                { text: "Former user", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 2,
              question_text:
                "Do you consume alcohol regularly (more than 2 drinks per day)?",
              options: [
                { text: "Yes", score: 7 },
                { text: "Occasionally", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 3,
              question_text:
                "Have you noticed white or red patches in your mouth that do not heal?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Unsure", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 4,
              question_text:
                "Do you have mouth ulcers lasting more than 3 weeks?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Unsure", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 5,
              question_text:
                "Have you noticed any lumps or thickening in your mouth or lips?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Unsure", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 6,
              question_text:
                "Do you experience numbness in your mouth or face?",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 7,
              question_text:
                "Do you have difficulty chewing, swallowing, or speaking?",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 8,
              question_text:
                "Do you experience persistent hoarseness or throat discomfort?",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 9,
              question_text:
                "Have you noticed any change in teeth alignment or denture fit?",
              options: [
                { text: "Yes", score: 5 },
                { text: "No", score: 0 },
                { text: "Not applicable", score: 0 },
              ],
            },

            {
              id: 10,
              question_text:
                "Have you noticed swelling or a lump in your neck or jaw?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Unsure", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 11,
              question_text:
                "Have you experienced unexplained bleeding in your mouth?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Unsure", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 12,
              question_text: "Do you go for regular dental check-ups?",
              options: [
                { text: "Yes", score: 0 },
                { text: "Occasionally", score: 3 },
                { text: "No", score: 5 },
              ],
            },
          ],
        },
        {
          id: "prostate_cancer",
          name: "Prostate Cancer",
          image: require("../../assets/SelfSenseProstateCancer.webp"),

          risk_copy: {
            low: {
              label: "LOW RISK",
              range: "IPSS 0–7",
              result_content:
                "Your symptoms are mild and do not indicate immediate concern. Routine monitoring is recommended along with healthy bladder habits. Periodic reassessment can help track any changes over time.",
            },

            moderate: {
              label: "MODERATE RISK",
              range: "IPSS 8–19",
              result_content:
                "Your symptoms suggest a moderate level of concern. A doctor consultation is advised within the next 3–4 weeks for clinical evaluation and guidance on symptom management.",
            },

            high: {
              label: "HIGH RISK",
              range: "IPSS 20–35",
              result_content:
                "Your symptoms indicate a high level of concern. Please consult a urologist within the next 1–2 weeks for prompt evaluation and further investigation.",
            },
          },

          questions: [
            {
              id: 1,
              question_text: "Incomplete bladder emptying",
              options: [
                { text: "Never", score: 0 },
                { text: "Rarely", score: 2 },
                { text: "Sometimes", score: 4 },
                { text: "Often", score: 6 },
                { text: "Almost always", score: 10 },
              ],
            },

            {
              id: 2,
              question_text: "Frequent urination",
              options: [
                { text: "Never", score: 0 },
                { text: "Rarely", score: 2 },
                { text: "Sometimes", score: 4 },
                { text: "Often", score: 6 },
                { text: "Almost always", score: 10 },
              ],
            },

            {
              id: 3,
              question_text: "Weak urine stream",
              options: [
                { text: "Never", score: 0 },
                { text: "Rarely", score: 2 },
                { text: "Sometimes", score: 4 },
                { text: "Often", score: 6 },
                { text: "Almost always", score: 10 },
              ],
            },

            {
              id: 4,
              question_text: "Straining to urinate",
              options: [
                { text: "Never", score: 0 },
                { text: "Rarely", score: 2 },
                { text: "Sometimes", score: 4 },
                { text: "Often", score: 6 },
                { text: "Almost always", score: 10 },
              ],
            },

            {
              id: 5,
              question_text: "Night-time urination",
              options: [
                { text: "None", score: 0 },
                { text: "1 time", score: 2 },
                { text: "2 times", score: 4 },
                { text: "3 times", score: 7 },
                { text: "4 or more times", score: 10 },
              ],
            },

            {
              id: 6,
              question_text: "Sudden urgency to urinate",
              options: [
                { text: "Never", score: 0 },
                { text: "Rarely", score: 2 },
                { text: "Sometimes", score: 4 },
                { text: "Often", score: 6 },
                { text: "Almost always", score: 10 },
              ],
            },

            {
              id: 7,
              question_text: "Blood in urine or semen",
              options: [
                { text: "Yes", score: 10 },
                { text: "Unsure", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 8,
              question_text: "Pain during urination or ejaculation",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 9,
              question_text: "Persistent lower back or hip pain",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 10,
              question_text: "Family history of prostate cancer",
              options: [
                { text: "Yes", score: 10 },
                { text: "Don't know", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 11,
              question_text: "When was your last PSA test or prostate exam?",
              options: [
                { text: "Less than 1 year ago", score: 0 },
                { text: "1–2 years ago", score: 3 },
                { text: "More than 2 years ago", score: 7 },
                { text: "Never", score: 10 },
                { text: "Don't know", score: 5 },
              ],
            },
          ],
        },

        {
          id: "colonrectal_cancer",
          name: "Colorectal Cancer",
          image: require("../../assets/SelfSenseColorectalCancer.webp"),
          risk_copy: {
            low: {
              label: "LOW RISK",
              range: "0–4 positive responses",
              result_content:
                "Low immediate concern. Routine colorectal screening is recommended starting from age 45, or earlier if advised by your physician based on personal or family history.",
            },

            moderate: {
              label: "MODERATE RISK",
              range: "5–8 positive responses",
              result_content:
                "Some risk factors are present. Please consult a physician within the next 2–3 weeks to determine the need for diagnostic evaluation such as FIT or colonoscopy.",
            },

            high: {
              label: "HIGH RISK",
              range: "9 or more positive responses",
              result_content:
                "High-risk symptoms detected. An urgent gastroenterology consultation is recommended within the next 1 week. Early detection is associated with approximately 90% survival.",
            },
          },

          questions: [
            {
              id: 1,
              question_text: "Change in bowel habits lasting more than 2 weeks",
              options: [
                { text: "Yes", score: 10 },
                { text: "Unsure", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 2,
              question_text: "Persistent diarrhea or constipation",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 3,
              question_text: "Blood in stool",
              options: [
                { text: "Yes", score: 10 },
                { text: "Unsure", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 4,
              question_text: "Feeling of incomplete bowel emptying",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 5,
              question_text: "Narrow or pencil-thin stools",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 6,
              question_text: "Persistent abdominal pain or discomfort",
              options: [
                { text: "Yes", score: 7 },
                { text: "Unsure", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 7,
              question_text: "Unexplained weight loss",
              options: [
                { text: "Yes", score: 10 },
                { text: "Unsure", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 8,
              question_text: "Unusual or persistent fatigue",
              options: [
                { text: "Yes", score: 5 },
                { text: "Unsure", score: 2 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 9,
              question_text: "Family history of colorectal cancer",
              options: [
                { text: "Yes", score: 10 },
                { text: "Don't know", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 10,
              question_text:
                "History of inflammatory bowel disease (ulcerative colitis or Crohn's disease)",
              options: [
                { text: "Yes", score: 10 },
                { text: "Unsure", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 11,
              question_text: "When was your last colonoscopy or FIT test?",
              options: [
                { text: "Less than 1 year ago", score: 0 },
                { text: "1–5 years ago", score: 2 },
                { text: "5–10 years ago", score: 5 },
                { text: "More than 10 years ago", score: 7 },
                { text: "Never", score: 10 },
              ],
            },

            {
              id: 12,
              question_text: "High intake of red or processed meat",
              options: [
                { text: "Yes", score: 7 },
                { text: "Occasionally", score: 3 },
                { text: "No", score: 0 },
              ],
            },

            {
              id: 13,
              question_text: "Do you engage in regular physical exercise?",
              options: [
                { text: "Yes", score: 0 },
                { text: "Occasionally", score: 3 },
                { text: "No", score: 5 },
              ],
            },
          ],
        },
      ],
    },

    // --- WELLBEING ---
    {
      category: "Wellbeing",
      conditions: [
        {
          id: "stress",
          name: "Stress",
          questions: [
            {
              id: 1,
              question_text:
                "How often do you feel overwhelmed by responsibilities?",
              options: [
                { text: "Almost every day", score: 10 },
                { text: "Weekly", score: 5 },
                { text: "Rarely", score: 0 },
              ],
            },
            {
              id: 2,
              question_text:
                "Do you have physical symptoms like headaches or muscle tension?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you find it hard to relax or switch off?",
              options: [
                { text: "Yes, very hard", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Does stress affect your sleep?",
              options: [
                { text: "Yes, insomnia/waking up", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
      ],
    },

    // --- SENSORY HEALTH ---
    {
      category: "Sensory Health",
      conditions: [
        {
          id: "hearing",
          name: "Hearing",
          image: require("../../assets/SelfSenseSensoryHealth.webp"),

          risk_copy: {
            low: {
              label: "LOW RISK",
              range: "Low cumulative risk score",
              result_content:
                "Your hearing appears to be normal. Continue protecting your ears from loud noises.",
            },
            moderate: {
              label: "MODERATE RISK",
              range: "Moderate cumulative risk score",
              result_content:
                "Some signs of hearing difficulty detected. Consider getting a professional audiometry test within the next 3 months.",
            },
            high: {
              label: "HIGH RISK",
              range: "High cumulative risk score",
              result_content:
                "Significant hearing concerns detected. Please consult an ENT specialist or audiologist as soon as possible.",
            },
          },

          questions: [
            // --- General Hearing Questions ---
            {
              id: 1,
              question_text: "Do you often ask people to repeat themselves?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text:
                "Do you keep the TV/Radio volume higher than others?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text:
                "Do you have trouble hearing in noisy environments?",
              options: [
                { text: "Yes, very difficult", score: 10 },
                { text: "Somewhat", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Are you exposed to loud noises regularly?",
              options: [
                { text: "Yes, daily", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },

            // --- Frequency-Based Hearing Test ---
            // 250 Hz — Deep bass hum (like a bass guitar or deep male voice)
            {
              id: 5,
              question_text:
                "🔊 250 Hz — Deep bass hum\n(Like a bass guitar or deep male voice)\n\nCan you hear this tone?",
              options: [
                { text: "Yes, clearly", score: 0 },
                { text: "Faintly / Barely", score: 5 },
                { text: "No, I can't hear it", score: 10 },
              ],
              isFrequencyTest: true,
              frequency: 250,
            },
            // 500 Hz — Low-mid tone (like a normal male speaking voice)
            {
              id: 6,
              question_text:
                "🔊 500 Hz — Low-mid tone\n(Like a normal male speaking voice)\n\nCan you hear this tone?",
              options: [
                { text: "Yes, clearly", score: 0 },
                { text: "Faintly / Barely", score: 5 },
                { text: "No, I can't hear it", score: 10 },
              ],
              isFrequencyTest: true,
              frequency: 500,
            },
            // 1000 Hz — Mid tone (like a female speaking voice)
            {
              id: 7,
              question_text:
                "🔊 1000 Hz — Mid-range tone\n(Like a female speaking voice)\n\nCan you hear this tone?",
              options: [
                { text: "Yes, clearly", score: 0 },
                { text: "Faintly / Barely", score: 5 },
                { text: "No, I can't hear it", score: 10 },
              ],
              isFrequencyTest: true,
              frequency: 1000,
            },
            // 2000 Hz — Upper-mid tone (like consonant sounds: S, T, F)
            {
              id: 8,
              question_text:
                "🔊 2000 Hz — Upper-mid tone\n(Like consonant sounds: S, T, F)\n\nCan you hear this tone?",
              options: [
                { text: "Yes, clearly", score: 0 },
                { text: "Faintly / Barely", score: 5 },
                { text: "No, I can't hear it", score: 10 },
              ],
              isFrequencyTest: true,
              frequency: 2000,
            },
            // 4000 Hz — High tone (like a bird chirping or phone ringing)
            {
              id: 9,
              question_text:
                "🔊 4000 Hz — High-pitched tone\n(Like a bird chirping or phone ringing)\n\nCan you hear this tone?",
              options: [
                { text: "Yes, clearly", score: 0 },
                { text: "Faintly / Barely", score: 5 },
                { text: "No, I can't hear it", score: 10 },
              ],
              isFrequencyTest: true,
              frequency: 4000,
            },
            // 8000 Hz — Very high tone (like a whistle or cymbal shimmer)
            {
              id: 10,
              question_text:
                "🔊 8000 Hz — Very high-pitched tone\n(Like a whistle or cymbal shimmer)\n\nCan you hear this tone?",
              options: [
                { text: "Yes, clearly", score: 0 },
                { text: "Faintly / Barely", score: 5 },
                { text: "No, I can't hear it", score: 10 },
              ],
              isFrequencyTest: true,
              frequency: 8000,
            },
          ],
        },
      ],
    },
  ],
  risk_logic: {
    thresholds: [
      {
        level: "Low Risk",
        range_min: 0,
        range_max: 20,
        color_code: "#28a745",
        message: "Your risk appears low. Keep maintaining a healthy lifestyle.",
      },
      {
        level: "Moderate Risk",
        range_min: 21,
        range_max: 45,
        color_code: "#ffc107",
        message:
          "You have some risk factors. Consider monitoring your health and consulting a doctor.",
      },
      {
        level: "High Risk",
        range_min: 46,
        range_max: Infinity,
        color_code: "#dc3545",
        message:
          "High risk detected. It is highly recommended to consult a specialist immediately.",
      },
    ],
  },
};

const QuestionnairesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { conditionId, conditionName, conditionImg } = route.params || {
    conditionId: "diabetes",
    conditionName: "Diabetes",
    conditionImg: require("../../assets/MobHands.webp"),
  };

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  // Audio state for frequency tests
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const playTone = useCallback(async (frequency) => {
    try {
      // Stop previous sound
      if (soundRef.current) {
        await soundRef.current.stopAsync().catch(() => {});
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const uri = getToneUri(frequency);
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, volume: 1.0 },
      );
      soundRef.current = sound;
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (e) {
      console.warn("Failed to play tone:", e);
      setIsPlaying(false);
    }
  }, []);

  const stopTone = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => {});
      await soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  // Animations
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Truncate disease text for fixed fit
  const rawInfo =
    CONDITION_DESCRIPTIONS[conditionId] || CONDITION_DESCRIPTIONS.default || "";
  const diseaseInfo =
    rawInfo.length > 85 ? rawInfo.substring(0, 85) + "..." : rawInfo;

  useEffect(() => {
    // Logic to find questions based on ID
    // Simplified flattening for robustness
    const allConditions = HEALTH_DATA.health_assessments.flatMap(
      (c) => c.conditions || [],
    );
    const cond = allConditions.find((c) => c.id === conditionId);

    if (cond) {
      setQuestions(cond.questions);
    } else {
      // Fallback for visual testing
      if (allConditions.length > 0) {
        setQuestions(allConditions[0].questions);
      }
    }
  }, [conditionId]);

  useEffect(() => {
    const completed = Object.keys(answers).length;
    if (questions.length > 0) {
      setAllQuestionsAnswered(completed === questions.length);
    }
  }, [answers, questions]);

  useEffect(() => {
    if (questions.length > 0) {
      const targetWidth = ((activeQuestionIndex + 1) / questions.length) * 100;
      Animated.timing(progressAnim, {
        toValue: targetWidth,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    }
  }, [activeQuestionIndex, questions]);

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [activeQuestionIndex]);

  // Auto-play tone when navigating to a frequency test question
  useEffect(() => {
    const currentQ = questions[activeQuestionIndex];
    if (currentQ?.isFrequencyTest && currentQ?.frequency) {
      // Small delay so the question card appears first
      const timer = setTimeout(() => playTone(currentQ.frequency), 400);
      return () => clearTimeout(timer);
    } else {
      // Stop any playing tone when leaving a frequency question
      stopTone();
    }
  }, [activeQuestionIndex, questions, playTone, stopTone]);

  const changeQuestion = (newIndex) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setActiveQuestionIndex(newIndex);
    });
  };

  const handleSelect = (questionId, optionObj) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: optionObj };
      // Persist in-progress answers to AsyncStorage
      AsyncStorage.setItem(
        "selfSenseProgress",
        JSON.stringify({
          conditionId,
          conditionName,
          answeredCount: Object.keys(updated).length,
          totalQuestions: questions.length,
          updatedAt: Date.now(),
        }),
      ).catch(() => {});
      return updated;
    });
    if (activeQuestionIndex < questions.length - 1) {
      setTimeout(() => changeQuestion(activeQuestionIndex + 1), 250);
    }
  };

  const goToPrevQuestion = () => {
    if (activeQuestionIndex > 0) changeQuestion(activeQuestionIndex - 1);
  };

  const goToNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1)
      changeQuestion(activeQuestionIndex + 1);
  };

  const calculateRiskAssessment = () => {
    let totalScore = 0;
    let riskFactors = [];

    questions.forEach((q) => {
      const ansObj = answers[q.id];
      if (ansObj) {
        totalScore += ansObj.score;
        if (ansObj.score >= 5) {
          riskFactors.push({
            question: q.question_text,
            answer: ansObj.text,
            severity: ansObj.score >= 10 ? "high" : "moderate",
          });
        }
      }
    });

    const thresholds = HEALTH_DATA.risk_logic.thresholds;
    const result =
      thresholds.find(
        (t) => totalScore >= t.range_min && totalScore <= t.range_max,
      ) || thresholds[0];

    return {
      conditionName,
      riskLevel: result.level,
      totalScore,
      message: result.message,
      colorCode: result.color_code,
      riskFactors,
      maxPossibleScore: HEALTH_DATA.risk_logic.total_possible_score,
    };
  };

  const handleSubmit = () => {
    if (!allQuestionsAnswered) return;
    // Clear in-progress data since assessment is complete
    AsyncStorage.removeItem("selfSenseProgress").catch(() => {});
    const assessment = calculateRiskAssessment();
    if (assessment.riskLevel === "Low Risk") {
      navigation.navigate("LowRisk", { assessment });
    } else if (assessment.riskLevel === "Moderate Risk") {
      navigation.navigate("ModerateRisk", { assessment });
    } else {
      navigation.navigate("HighRisk", { assessment });
    }
  };

  const activeQ = questions[activeQuestionIndex];
  if (!activeQ) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* --- HEADER (Fixed with Gradient Background) --- */}
      <View style={styles.header}>
        <LinearGradient
          colors={["rgba(228,204,247,0.75)", "rgba(255,233,207,0.75)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.headerSafeArea}>
          {/* Top Navigation */}
          <View style={styles.heroTopBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Feather name="arrow-left" size={22} color="#553fb5" />
            </TouchableOpacity>

            <Text
              style={styles.heroTitle}
              weight="700"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {conditionName}
            </Text>
          </View>

          {/* Image + Info Row */}
          <View style={styles.headerContentRow}>
            <Image
              source={conditionImg}
              style={styles.illustration}
              resizeMode="contain"
            />

            <View style={styles.infoBox}>
              <Text style={styles.infoText} weight="500" numberOfLines={4}>
                {diseaseInfo}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* --- BODY (Fixed Content) --- */}
      <View style={styles.bodyContainer}>
        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressText} weight="700">
              Q{activeQuestionIndex + 1}
            </Text>
            <Text style={styles.progressTextTotal} weight="600">
              /{questions.length}
            </Text>
          </View>
          <View style={styles.track}>
            <AnimatedLinearGradient
              colors={["#c4b5fd", "#7c3aed"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.fill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
            {/* subtle glow */}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.fillGlow,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                  opacity: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, 0.9],
                  }),
                },
              ]}
            />
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.fixedCardContainer}>
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <ScrollView
              style={styles.glassCardScroll}
              contentContainerStyle={styles.glassCard}
              showsVerticalScrollIndicator={false}
              bounces={true}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.questionText} weight="700" numberOfLines={4}>
                {activeQ.question_text}
              </Text>

              {/* Play Tone Button for frequency tests */}
              {activeQ.isFrequencyTest && (
                <TouchableOpacity
                  style={[
                    styles.playToneBtn,
                    isPlaying && styles.playToneBtnActive,
                  ]}
                  onPress={() =>
                    isPlaying ? stopTone() : playTone(activeQ.frequency)
                  }
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      isPlaying
                        ? ["#dc3545", "#c82333"]
                        : ["#7C3AED", "#5B21B6"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.playToneGradient}
                  >
                    <MaterialCommunityIcons
                      name={isPlaying ? "stop" : "play"}
                      size={22}
                      color="#fff"
                    />
                    <Text weight="700" style={styles.playToneText}>
                      {isPlaying
                        ? "Stop Tone"
                        : `Play ${activeQ.frequency} Hz Tone`}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              <View style={styles.optionsContainer}>
                {activeQ.options.map((opt, i) => (
                  <OptionItem
                    key={i}
                    option={opt}
                    isSelected={answers[activeQ.id]?.text === opt.text}
                    onPress={() => handleSelect(activeQ.id, opt)}
                  />
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </View>

      {/* --- FOOTER --- */}
      <View style={styles.footer}>
        <View style={styles.footerNavRow}>
          <TouchableOpacity
            onPress={goToPrevQuestion}
            disabled={activeQuestionIndex === 0}
            style={[
              styles.navCircle,
              activeQuestionIndex === 0 && styles.navCircleDisabled,
            ]}
          >
            <Feather name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>

          {allQuestionsAnswered ? (
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#c084fc", "#7c3aed"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                <Text style={styles.submitText} weight="800">
                  FINISH
                </Text>
                <Feather name="check-circle" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          <TouchableOpacity
            onPress={goToNextQuestion}
            disabled={activeQuestionIndex === questions.length - 1}
            style={[
              styles.navCircle,
              activeQuestionIndex === questions.length - 1 &&
                styles.navCircleDisabled,
            ]}
          >
            <Feather name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// --- COMPACT OPTION BUTTON ---
const OptionItem = ({ option, isSelected, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    onPress();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.optionBtn,
          isSelected && styles.optionBtnSelected,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text
          style={[styles.optionText, isSelected && styles.optionTextSelected]}
          weight={isSelected ? "600" : "500"}
          numberOfLines={1}
        >
          {option.text}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default QuestionnairesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  // --- HEADER ---
  header: {
    width: "100%",
    height: 260, // ⬆ increased for premium spacing
    justifyContent: "flex-start",
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
  },

  headerSafeArea: {
    paddingHorizontal: 20,
    flex: 1,
  },

  heroTopBar: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    backgroundColor: "rgba(255,255,255,0.35)",
    padding: 8,
    borderRadius: 14,
    marginRight: 12,
  },

  heroTitle: {
    flex: 1,
    fontSize: 22,
    color: "#553fb5",
  },

  headerContentRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  illustration: {
    width: 180,
    height: 180,
  },

  infoBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,

    shadowColor: "#553fb5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },

  infoText: {
    fontSize: 18,
    color: "#4B5563",
  },

  // --- BODY (Fixed) ---
  bodyContainer: {
    flex: 1,
    backgroundColor: "#FBF7FF",
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  progressSection: {
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressLabelRow: {
    flexDirection: "row",
    alignItems: "baseline",
    width: 60,
  },
  progressText: {
    fontSize: 22,
    color: "#4c1d95",
  },
  progressTextTotal: {
    fontSize: 16,
    color: "#9aa3bf",
  },
  track: {
    flex: 1,
    height: 10,
    backgroundColor: "rgba(124,58,237,0.08)",
    borderRadius: 6,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 6,
  },
  fillGlow: {
    position: "absolute",
    height: 10,
    left: 0,
    top: -6,
    borderRadius: 20,
    backgroundColor: "rgba(124,58,237,0.16)",
    filter: undefined,
  },

  fixedCardContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  cardWrapper: {
    width: "100%",
    flex: 1,
  },
  glassCardScroll: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 26,
  },
  glassCard: {
    padding: 24,
    paddingBottom: 30,
  },
  questionText: {
    fontSize: 20,
    color: "#111827",
    marginBottom: 22,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 14,
  },
  // --- OPTION BUTTONS ---
  optionBtn: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E8E0F0",
    shadowColor: "#E8E0F0",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,
  },
  optionBtnSelected: {
    backgroundColor: "#F8F5FF",
    borderColor: "#7c3aed",
    borderWidth: 2,
  },
  optionText: {
    fontSize: 18,
    color: "#1f2937",
  },
  optionTextSelected: {
    color: "#4c1d95",
  },

  // --- FOOTER ---
  footer: {
    height: 100,
    backgroundColor: "#FBF7FF",
    justifyContent: "center",
    paddingHorizontal: 26,
  },
  footerNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8,
  },
  navCircleDisabled: {
    backgroundColor: "#e6e6ea",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 10,
  },
  submitGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    height: 56,
    borderRadius: 28,
    gap: 8,
  },
  submitText: {
    color: "#fff",
    fontSize: 19,
    letterSpacing: 1,
    marginRight: 8,
    textTransform: "uppercase",
  },

  // --- Play Tone Button ---
  playToneBtn: {
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  playToneBtnActive: {
    shadowColor: "#dc3545",
  },
  playToneGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 10,
    borderRadius: 14,
  },
  playToneText: {
    color: "#fff",
    fontSize: 15,
  },
});
