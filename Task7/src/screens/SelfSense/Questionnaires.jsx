import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
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
import { Feather, MaterialIcons } from "@expo/vector-icons";
// Assuming TextWrapper exists
import { Text } from "../../../components/TextWrapper";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// --- 1. SUPPLEMENTARY DISPLAY DATA ---
const CONDITION_DESCRIPTIONS = {
  diabetes: "Monitoring blood sugar and lifestyle choices are key.",
  hypertension: "Regular checks help prevent heart disease.",
  pcos: "Early diagnosis helps management of hormone levels.",
  thyroid: "Monitor metabolism and energy levels regularly.",
  heart: "Diet, exercise, and stress management are vital.",
  obesity: "Weight management reduces long-term health risks.",
  breast_cancer: "Regular self-exams are crucial for early detection.",
  lung_cancer: "Avoid tobacco and pollutants to protect lungs.",
  oral_cancer: "Early detection of sores improves outcomes.",
  skin_cancer: "Protect skin from UV rays and check moles.",
  prostate_cancer: "Screening is important for men over 50.",
  colon_cancer: "Monitor bowel habits and screen regularly.",
  stress: "Finding balance is key to mental health.",
  anxiety: "Anxiety is manageable with support and therapy.",
  sleep: "Quality sleep is essential for immune function.",
  burnout: "Rest and boundaries are necessary.",
  mood: "Tracking mood helps identify patterns.",
  focus: "Limit distractions to improve productivity.",
  vision: "Regular eye exams prevent strain.",
  hearing: "Protect ears from loud noise.",
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
          id: "diabetes",
          name: "Diabetes",
          questions: [
            {
              id: 1,
              question_text: "Do you have a family history of Type 2 Diabetes?",
              options: [
                { text: "Yes, immediate family", score: 10 },
                { text: "Yes, extended family", score: 5 },
                { text: "No known history", score: 0 },
                { text: "Not sure", score: 2 },
              ],
            },
            {
              id: 2,
              question_text:
                "Have you ever been diagnosed with high blood sugar?",
              options: [
                { text: "Yes, diagnosed", score: 10 },
                { text: "No, never", score: 0 },
                { text: "Not sure", score: 5 },
              ],
            },
            {
              id: 3,
              question_text: "How often do you exercise?",
              options: [
                { text: "Daily", score: 0 },
                { text: "3–5 times a week", score: 3 },
                { text: "Rarely", score: 7 },
                { text: "Never", score: 10 },
              ],
            },
            {
              id: 4,
              question_text: "Do you experience frequent thirst or urination?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
                { text: "Not sure", score: 2 },
              ],
            },
          ],
        },
        {
          id: "hypertension",
          name: "Hypertension",
          questions: [
            {
              id: 1,
              question_text:
                "Is your blood pressure consistently above 120/80?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
                { text: "I don't check", score: 3 },
              ],
            },
            {
              id: 2,
              question_text:
                "Do you consume high-salt or processed foods often?",
              options: [
                { text: "Daily", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "Rarely", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you have a family history of High BP?",
              options: [
                { text: "Yes, immediate family", score: 10 },
                { text: "Yes, extended family", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text:
                "Do you experience frequent headaches or dizzy spells?",
              options: [
                { text: "Yes, frequently", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "pcos",
          name: "PCOS",
          questions: [
            {
              id: 1,
              question_text: "Do you experience irregular periods?",
              options: [
                { text: "Yes, frequently", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text:
                "Have you noticed excess facial/body hair or acne?",
              options: [
                { text: "Yes, significant", score: 10 },
                { text: "Mild", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you struggle with unexplained weight gain?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Somewhat", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Is there a family history of PCOS?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Not sure", score: 2 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "thyroid",
          name: "Thyroid",
          questions: [
            {
              id: 1,
              question_text:
                "Do you experience unexplained fatigue or weakness?",
              options: [
                { text: "Yes, constantly", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text:
                "Have you noticed sudden weight changes (gain or loss)?",
              options: [
                { text: "Yes, significant", score: 10 },
                { text: "Mild", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you have sensitivity to cold or heat?",
              options: [
                { text: "Yes, very sensitive", score: 10 },
                { text: "Somewhat", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Is there a family history of Thyroid disorders?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Not sure", score: 2 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "heart",
          name: "Heart Health",
          questions: [
            {
              id: 1,
              question_text:
                "Do you experience chest pain or shortness of breath?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Only with exertion", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Do you have high cholesterol levels?",
              options: [
                { text: "Yes, diagnosed", score: 10 },
                { text: "Borderline", score: 5 },
                { text: "No", score: 0 },
                { text: "Not sure", score: 2 },
              ],
            },
            {
              id: 3,
              question_text:
                "Do you smoke or have family history of heart disease?",
              options: [
                { text: "Yes, both/either", score: 10 },
                { text: "Used to smoke", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "How would you rate your diet?",
              options: [
                { text: "High fat/sugar", score: 10 },
                { text: "Average", score: 5 },
                { text: "Healthy", score: 0 },
              ],
            },
          ],
        },
        {
          id: "obesity",
          name: "Obesity",
          questions: [
            {
              id: 1,
              question_text: "Is your BMI over 30?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Overweight (25-30)", score: 5 },
                { text: "No / Normal", score: 0 },
                { text: "Not sure", score: 2 },
              ],
            },
            {
              id: 2,
              question_text: "Do you have difficulty with physical movement?",
              options: [
                { text: "Yes, significant", score: 10 },
                { text: "Mild difficulty", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you eat large portions or snack frequently?",
              options: [
                { text: "Yes, frequently", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Is there a family history of obesity?",
              options: [
                { text: "Yes, immediate family", score: 10 },
                { text: "Extended family", score: 5 },
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
          questions: [
            {
              id: 1,
              question_text:
                "Have you noticed any lumps in the breast/underarm?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Not sure", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Is there a family history of breast cancer?",
              options: [
                { text: "Yes, mother/sister", score: 10 },
                { text: "Yes, extended family", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Have you noticed skin changes or discharge?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Slight changes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Do you perform regular self-exams?",
              options: [
                { text: "No / Never", score: 10 },
                { text: "Rarely", score: 5 },
                { text: "Yes, monthly", score: 0 },
              ],
            },
          ],
        },
        {
          id: "lung_cancer",
          name: "Lung Cancer",
          questions: [
            {
              id: 1,
              question_text:
                "Do you currently smoke or have a history of smoking?",
              options: [
                { text: "Yes, current smoker", score: 10 },
                { text: "Ex-smoker", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Do you have a persistent cough?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text:
                "Are you exposed to secondhand smoke or pollutants?",
              options: [
                { text: "Yes, frequently", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text:
                "Have you coughed up blood or rust-colored sputum?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Not sure", score: 5 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "oral_cancer",
          name: "Oral Cancer",
          questions: [
            {
              id: 1,
              question_text: "Do you use tobacco (smoking or chewing)?",
              options: [
                { text: "Yes, regularly", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Do you have mouth sores that haven't healed?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Not sure", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you have persistent pain or patches in mouth?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Mild discomfort", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Do you consume alcohol heavily?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Moderately", score: 5 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "skin_cancer",
          name: "Skin Cancer",
          questions: [
            {
              id: 1,
              question_text: "Do you have moles that changed shape/color?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Not sure", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text:
                "Do you get frequent sunburns or use tanning beds?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you have fair skin that burns easily?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Medium skin", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Is there a family history of skin cancer?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Not sure", score: 2 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "prostate_cancer",
          name: "Prostate Cancer",
          questions: [
            {
              id: 1,
              question_text:
                "Do you have difficulty urinating or frequent urges?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Are you over the age of 50?",
              options: [
                { text: "Yes", score: 10 },
                { text: "40-50", score: 5 },
                { text: "Under 40", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Is there a family history of prostate cancer?",
              options: [
                { text: "Yes, immediate family", score: 10 },
                { text: "Extended family", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Have you experienced blood in urine or semen?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Not sure", score: 5 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "colon_cancer",
          name: "Colon Cancer",
          questions: [
            {
              id: 1,
              question_text: "Have you noticed changes in bowel habits?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Have you experienced rectal bleeding?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Not sure", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Is there a family history of colorectal cancer?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Not sure", score: 2 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Is your diet high in red or processed meats?",
              options: [
                { text: "Yes, daily", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
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
              question_text: "How often do you feel overwhelmed?",
              options: [
                { text: "Almost every day", score: 10 },
                { text: "Weekly", score: 5 },
                { text: "Rarely", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Do you have physical symptoms like headaches?",
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
                { text: "Yes, insomnia", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "anxiety",
          name: "Anxiety",
          questions: [
            {
              id: 1,
              question_text: "Do you feel nervous, anxious, or on edge?",
              options: [
                { text: "Nearly every day", score: 10 },
                { text: "Several days", score: 5 },
                { text: "Not at all", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Do you have trouble controlling worrying?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text:
                "Do you experience restlessness or rapid heart rate?",
              options: [
                { text: "Yes, frequently", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Does anxiety interfere with daily work?",
              options: [
                { text: "Yes, significantly", score: 10 },
                { text: "Somewhat", score: 5 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "sleep",
          name: "Sleep Health",
          questions: [
            {
              id: 1,
              question_text: "How many hours of sleep do you get on average?",
              options: [
                { text: "< 5 hours", score: 10 },
                { text: "5-6 hours", score: 5 },
                { text: "7-9 hours", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Do you have trouble falling or staying asleep?",
              options: [
                { text: "Yes, regularly", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you feel tired or groggy upon waking?",
              options: [
                { text: "Yes, almost always", score: 10 },
                { text: "Often", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Do you snore loudly or gasp for air?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Told by others", score: 5 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "burnout",
          name: "Burnout",
          questions: [
            {
              id: 1,
              question_text: "Do you feel emotionally exhausted or drained?",
              options: [
                { text: "Yes, constantly", score: 10 },
                { text: "Often", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Have you become cynical/detached from work?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Somewhat", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you feel your performance has declined?",
              options: [
                { text: "Yes, significantly", score: 10 },
                { text: "A little", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Do you lack motivation to start your day?",
              options: [
                { text: "Every day", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "mood",
          name: "Mood",
          questions: [
            {
              id: 1,
              question_text: "Have you felt down, depressed, or hopeless?",
              options: [
                { text: "Nearly every day", score: 10 },
                { text: "Several days", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Do you have little interest in doing things?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you experience severe mood swings?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "How is your appetite?",
              options: [
                { text: "Poor / Overeating", score: 10 },
                { text: "Variable", score: 5 },
                { text: "Normal", score: 0 },
              ],
            },
          ],
        },
        {
          id: "focus",
          name: "Focus & Attention",
          questions: [
            {
              id: 1,
              question_text: "Do you have trouble concentrating on tasks?",
              options: [
                { text: "Yes, very often", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Are you easily distracted by external stimuli?",
              options: [
                { text: "Yes, easily", score: 10 },
                { text: "Somewhat", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you have difficulty organizing tasks?",
              options: [
                { text: "Yes, frequently", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Do you experience 'brain fog'?",
              options: [
                { text: "Yes, often", score: 10 },
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
          id: "vision",
          name: "Vision",
          questions: [
            {
              id: 1,
              question_text: "Do you experience blurred vision or eye strain?",
              options: [
                { text: "Yes, frequently", score: 10 },
                { text: "After screens", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Do you get frequent headaches around the eyes?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you have trouble seeing at night?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Slightly", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "When was your last eye exam?",
              options: [
                { text: "Over 2 years ago", score: 10 },
                { text: "1-2 years ago", score: 5 },
                { text: "Within last year", score: 0 },
              ],
            },
          ],
        },
        {
          id: "hearing",
          name: "Hearing",
          questions: [
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
              question_text: "Do you keep the TV/Radio volume high?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you have trouble hearing in noise?",
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
          ],
        },
        {
          id: "tinnitus",
          name: "Tinnitus",
          questions: [
            {
              id: 1,
              question_text: "Do you hear ringing or buzzing in your ears?",
              options: [
                { text: "Yes, constantly", score: 10 },
                { text: "Intermittently", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Does the sound interfere with your sleep?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Is it in one ear or both?",
              options: [
                { text: "One ear", score: 10 },
                { text: "Both", score: 5 },
                { text: "N/A", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Do you have a history of ear infections?",
              options: [
                { text: "Yes, frequent", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "smell",
          name: "Smell",
          questions: [
            {
              id: 1,
              question_text: "Have you noticed a reduced ability to smell?",
              options: [
                { text: "Yes, significant", score: 10 },
                { text: "Mild reduction", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Do you experience phantom smells?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Rarely", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you have chronic sinus issues?",
              options: [
                { text: "Yes, chronic", score: 10 },
                { text: "Seasonal", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Has this affected your ability to taste food?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Slightly", score: 5 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "taste",
          name: "Taste",
          questions: [
            {
              id: 1,
              question_text: "Do foods taste blander than usual?",
              options: [
                { text: "Yes, significantly", score: 10 },
                { text: "A little", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Do you have a persistent metallic taste?",
              options: [
                { text: "Yes, constantly", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you have dry mouth frequently?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Do you smoke or maintain poor oral hygiene?",
              options: [
                { text: "Yes, both/either", score: 10 },
                { text: "Trying to improve", score: 5 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "touch",
          name: "Touch (Neuropathy)",
          questions: [
            {
              id: 1,
              question_text: "Do you feel numbness in hands/feet?",
              options: [
                { text: "Yes, frequently", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text: "Do you have burning sensations or sharp pains?",
              options: [
                { text: "Yes, painful", score: 10 },
                { text: "Mild discomfort", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you have difficulty with coordination?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Do you have diabetes/vitamin deficiencies?",
              options: [
                { text: "Yes, diagnosed", score: 10 },
                { text: "Suspected", score: 5 },
                { text: "No", score: 0 },
              ],
            },
          ],
        },
      ],
    },
  ],
  risk_logic: {
    total_possible_score: 40,
    thresholds: [
      {
        level: "Low Risk",
        range_min: 0,
        range_max: 10,
        color_code: "#28a745",
        message: "Low risk.",
      },
      {
        level: "Moderate Risk",
        range_min: 11,
        range_max: 25,
        color_code: "#ffc107",
        message: "Moderate risk.",
      },
      {
        level: "High Risk",
        range_min: 26,
        range_max: 40,
        color_code: "#dc3545",
        message: "High risk.",
      },
    ],
  },
};

const QuestionnairesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { conditionId, conditionName } = route.params || {
    conditionId: "diabetes",
    conditionName: "Diabetes",
  };

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

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
      duration: 400,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [activeQuestionIndex]);

  const changeQuestion = (newIndex) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.bezier(0.4, 0.0, 0.6, 1),
      useNativeDriver: true,
    }).start(() => {
      setActiveQuestionIndex(newIndex);
    });
  };

  const handleSelect = (questionId, optionObj) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionObj }));
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

      {/* --- HEADER (Fixed with ImageBackground) --- */}
      <ImageBackground
        source={require("../../../assets/Head.png")}
        style={styles.header}
        imageStyle={styles.headerImageBg}
      >
        <View style={styles.headerSafeArea}>
          {/* Navigation Row */}
          <View style={styles.navRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconBtn}
            >
              <Feather name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} weight="800">
              {conditionName}
            </Text>
          </View>

          {/* Illustration & Info (Side by Side) */}
          <View style={styles.headerContentRow}>
            <Animated.Image
              source={require("../../../assets/MobHands.png")}
              style={[
                styles.illustration,
                { opacity: fadeAnim },
              ]}
            />
            <View style={styles.infoBox}>
              <Text style={styles.infoText} weight="600" numberOfLines={3}>
                {diseaseInfo}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>

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
            <Animated.View
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
            <View style={styles.glassCard}>
              <Text style={styles.questionText} weight="700" numberOfLines={3}>
                {activeQ.question_text}
              </Text>

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
            </View>
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
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText} weight="800">
                FINISH
              </Text>
              <Feather name="check-circle" size={18} color="#fff" />
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
        <View
          style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}
        >
          {isSelected && <View style={styles.radioDot} />}
        </View>
        <Text
          style={[styles.optionText, isSelected && styles.optionTextSelected]}
          weight={isSelected ? "700" : "500"}
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
    backgroundColor: "#FDF4FF",
  },
  // --- HEADER ---
  header: {
    width: "100%",
    height: 220, // Increased height for better image display
    justifyContent: "flex-start",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    // No background color, purely image-based
  },
  headerImageBg: {
    resizeMode: "cover",
    opacity: 1,
  },
  headerSafeArea: {
    paddingTop: Platform.OS === "android" ? 40 : 50,
    paddingHorizontal: 20,
    flex: 1,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.8)",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    color: "#3e1c66", // Dark purple for contrast on light header
    letterSpacing: 0.5,
  },
  headerContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 10,
    paddingRight: 10,
  },
  illustration: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    marginRight: 10,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.75)",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    color: "#4a148c",
    fontSize: 14,
    lineHeight: 20,
  },

  // --- BODY (Fixed) ---
  bodyContainer: {
    flex: 1,
    backgroundColor: "#FDF4FF",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  progressSection: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressLabelRow: {
    flexDirection: "row",
    alignItems: "baseline",
    width: 55,
  },
  progressText: {
    fontSize: 16,
    color: "#4c1d95",
  },
  progressTextTotal: {
    fontSize: 12,
    color: "#94a3b8",
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: "#E9D5FF",
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#7c3aed",
    borderRadius: 4,
  },

  fixedCardContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  cardWrapper: {
    width: "100%",
  },
  glassCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#4c1d95",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f8fafc",
  },
  questionText: {
    fontSize: 17,
    color: "#1e293b",
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  // --- OPTION BUTTONS ---
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
  },
  optionBtnSelected: {
    backgroundColor: "#faf5ff",
    borderColor: "#8b5cf6",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleSelected: {
    borderColor: "#7c3aed",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#7c3aed",
  },
  optionText: {
    fontSize: 15,
    color: "#475569",
    flex: 1,
  },
  optionTextSelected: {
    color: "#6d28d9",
    fontWeight: "700",
  },

  // --- FOOTER ---
  footer: {
    height: 90,
    backgroundColor: "#FDF4FF",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  footerNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#8b5cf6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  navCircleDisabled: {
    backgroundColor: "#cbd5e1",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#8b5cf6",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    letterSpacing: 1,
    marginRight: 8,
  },
});
