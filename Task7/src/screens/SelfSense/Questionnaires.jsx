import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
  Dimensions,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { Text } from "../../../components/TextWrapper";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
              question_text:
                "Do you have a family history of Type 2 Diabetes? (Parent, sibling)",
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
                "Have you ever been diagnosed with high blood sugar or prediabetes?",
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
                { text: "Only with heavy exertion", score: 5 },
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
                "Do you smoke or have a family history of heart disease?",
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
                { text: "Between 25-30 (Overweight)", score: 5 },
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
                "Have you noticed any lumps or thickening in the breast/underarm?",
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
              question_text:
                "Have you noticed changes in skin texture or nipple discharge?",
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
              question_text:
                "Do you have a persistent cough that won't go away?",
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
              question_text:
                "Do you have mouth sores that haven't healed for 2 weeks?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Not sure", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text:
                "Do you have persistent pain or white/red patches in your mouth?",
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
              question_text:
                "Do you have moles that have changed shape, color, or size?",
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
                "Do you have difficulty urinating or frequent urges at night?",
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
              question_text:
                "Have you noticed changes in bowel habits lasting over a few days?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text:
                "Have you experienced rectal bleeding or blood in stool?",
              options: [
                { text: "Yes", score: 10 },
                { text: "Not sure", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text:
                "Is there a family history of colorectal cancer or polyps?",
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
              question_text:
                "Do you have trouble stopping or controlling worrying?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text:
                "Do you experience restlessness or increased heart rate?",
              options: [
                { text: "Yes, frequently", score: 10 },
                { text: "Occasionally", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Does anxiety interfere with daily work/school?",
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
                { text: "Less than 5 hours", score: 10 },
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
              question_text:
                "Have you become cynical or detached from work/activities?",
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
              question_text:
                "Have you felt down, depressed, or hopeless recently?",
              options: [
                { text: "Nearly every day", score: 10 },
                { text: "Several days", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text:
                "Do you have little interest or pleasure in doing things?",
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
          ],
        },
        {
          id: "tinnitus",
          name: "Tinnitus",
          questions: [
            {
              id: 1,
              question_text:
                "Do you hear ringing, buzzing, or hissing in your ears?",
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
                { text: "One ear (consult doctor)", score: 10 },
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
                { text: "Yes, significant loss", score: 10 },
                { text: "Mild reduction", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 2,
              question_text:
                "Do you experience phantom smells (smelling things not there)?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Rarely", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 3,
              question_text: "Do you have chronic sinus issues or allergies?",
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
              question_text:
                "Do you have a persistent metallic or bitter taste?",
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
              question_text:
                "Do you experience numbness or tingling in hands/feet?",
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
              question_text:
                "Do you have difficulty with coordination or balance?",
              options: [
                { text: "Yes, often", score: 10 },
                { text: "Sometimes", score: 5 },
                { text: "No", score: 0 },
              ],
            },
            {
              id: 4,
              question_text: "Do you have diabetes or vitamin deficiencies?",
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
        message: "Your risk appears low. Keep maintaining a healthy lifestyle.",
      },
      {
        level: "Moderate Risk",
        range_min: 11,
        range_max: 25,
        color_code: "#ffc107",
        message:
          "You have some risk factors. Consider monitoring your health and consulting a doctor.",
      },
      {
        level: "High Risk",
        range_min: 26,
        range_max: 40,
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

  // 🔥 2. RETRIEVE PASSED PARAMS
  const { conditionId, conditionName } = route.params || {
    conditionId: "diabetes",
    conditionName: "Diabetes",
  };

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [animationDirection, setAnimationDirection] = useState("right");
  
  // 🔥 3. ANIMATION REFS
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current; // Opacity controls fade in/out

  useEffect(() => {
    let found = false;
    for (const cat of HEALTH_DATA.health_assessments) {
      const cond = cat.conditions.find((c) => c.id === conditionId);
      if (cond) {
        setQuestions(cond.questions);
        found = true;
        break;
      }
    }
    if (!found) {
      Alert.alert(
        "Error",
        `Questions for ${conditionName} are not yet available.`,
      );
      // If not found, go back immediately to prevent stuck screen
      navigation.goBack();
    }
  }, [conditionId]);

  useEffect(() => {
    const completed = Object.keys(answers).length;
    if (questions.length > 0) {
      setAllQuestionsAnswered(completed === questions.length);
    }
  }, [answers, questions]);

  // 🔥 4. TRIGGER ANIMATION ON QUESTION CHANGE (THE "APPEAR" PHASE)
  useEffect(() => {
    // Reset slide
    slideAnim.setValue(animationDirection === "right" ? 50 : -50);

    // Animate In: Fade to 1 and Slide to 0 simultaneously
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeQuestionIndex]); 

  // 🔥 5. HELPER: FADE OUT -> CHANGE DATA -> FADE IN (THE "DISAPPEAR" PHASE)
  const changeQuestion = (newIndex) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200, // Fast fade out
      useNativeDriver: true,
    }).start(() => {
      // Once hidden, update index. This triggers the useEffect above to fade back in.
      setActiveQuestionIndex(newIndex);
    });
  };

  const handleSelect = (questionId, optionObj) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionObj }));

    if (activeQuestionIndex < questions.length - 1) {
      setAnimationDirection("right");
      // Wait a moment for selection feedback, then fade out
      setTimeout(() => {
          changeQuestion(activeQuestionIndex + 1);
      }, 200);
    }
  };

  const goToNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setAnimationDirection("right");
      changeQuestion(activeQuestionIndex + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      setAnimationDirection("left");
      changeQuestion(activeQuestionIndex - 1);
    }
  };

  const progressPct = useMemo(() => {
    if (questions.length === 0) return 0;
    return (Object.keys(answers).length / questions.length) * 100;
  }, [answers, questions]);

  // 🔥 6. SCORING LOGIC
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

  // 🔥 7. SUBMIT LOGIC
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

  // 🔥 8. RESET LOGIC (UPDATED: Navigate to SelfSense)
  const resetQuestionnaire = () => {
    setAnswers({});
    setActiveQuestionIndex(0);
    navigation.navigate("SelfSense");
  };

  const activeQ = questions[activeQuestionIndex];

  if (!activeQ) return null; // Loading state

  return (
    <View style={styles.page}>
      {/* ===== UPDATED HEADER ===== */}
      <ImageBackground
        source={require("../../../assets/Head.png")} // Check path
        style={styles.hero}
        imageStyle={styles.heroBgImage}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={24} color="#553fb5" />
        </TouchableOpacity>

        {/* 🔥 ANIMATED Centered Mobile Hands Illustration */}
        <View style={styles.illustrationContainer}>
          <Animated.Image 
            source={require("../../../assets/MobHands.webp")} // Check path
            style={[
                styles.illustration,
                { opacity: fadeAnim } // Bind opacity
            ]}
          />
        </View>
      </ImageBackground>

      {/* ===== BODY ===== */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressIndicator}>
            <Animated.View
              style={[styles.progressBar, { width: `${progressPct}%` }]}
            />
          </View>
          <Text style={styles.progressText} weight="500">
            {activeQuestionIndex + 1} of {questions.length}
          </Text>

          {/* Navigation Buttons */}
          <View style={styles.questionNav}>
            <Pressable
              style={({ pressed }) => [
                styles.navButton,
                styles.navPrev,
                pressed && styles.navPrevPressed,
                activeQuestionIndex === 0 && styles.navDisabled,
              ]}
              onPress={goToPrevQuestion}
              disabled={activeQuestionIndex === 0}
            >
              <Text style={styles.navPrevText} weight="600">
                Previous
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.navButton,
                styles.navNext,
                pressed && styles.navNextPressed,
                activeQuestionIndex === questions.length - 1 &&
                  styles.navDisabled,
              ]}
              onPress={goToNextQuestion}
              disabled={activeQuestionIndex === questions.length - 1}
            >
              <Text style={styles.navNextText} weight="700">
                Next
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 🔥 Single Active Question Card - ANIMATED */}
        <Animated.View
          style={[
            styles.activeCardWrapper,
            { 
                transform: [{ translateX: slideAnim }],
                opacity: fadeAnim // Bind opacity here too
            },
          ]}
        >
          <QuestionCard
            question={activeQ}
            selectedAnswerObj={answers[activeQ.id]}
            onSelect={(optObj) => handleSelect(activeQ.id, optObj)}
            isAnswered={!!answers[activeQ.id]}
          />
        </Animated.View>
      </ScrollView>

      {/* ===== BOTTOM TRAY ===== */}
      <View style={styles.bottomTray}>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            !allQuestionsAnswered && styles.actionBtnDisabled,
          ]}
          disabled={!allQuestionsAnswered}
          onPress={handleSubmit}
        >
          <Text style={styles.actionBtnText} weight="700">
            Submit Assessment
          </Text>
        </TouchableOpacity>

        {/* 🔥 RESET BUTTON */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.secondaryBtn]}
          onPress={resetQuestionnaire}
        >
          <Text
            style={[styles.actionBtnText, styles.secondaryBtnText]}
            weight="500"
          >
            Reset
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ===== Single Question Card ===== */
const QuestionCard = ({
  question,
  selectedAnswerObj,
  onSelect,
  isAnswered,
}) => {
  return (
    <View style={styles.accordionItem}>
      <View style={styles.accordionHeader}>
        <View style={styles.questionNumWrap}>
          <View style={styles.questionNum}>
            <Text style={{ color: "#553fb5", fontSize: 14 }} weight="600">
              Q{question.id}
            </Text>
            {isAnswered && (
              <View style={styles.answerIndicator}>
                <Feather name="check" size={10} color="#fff" />
              </View>
            )}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.questionText} weight="600">
            {question.question_text}
          </Text>
        </View>
      </View>

      <View style={styles.optionsWrap}>
        {question.options.map((opt, i) => {
          const selected = selectedAnswerObj?.text === opt.text;
          return (
            <TouchableOpacity
              key={`${question.id}-${i}`}
              style={[styles.optionCard, selected && styles.optionCardSelected]}
              onPress={() => onSelect(opt)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected && { color: "#553fb5", fontWeight: "700" },
                ]}
                weight={selected ? "700" : "500"}
              >
                {opt.text}
              </Text>
              {selected && <Feather name="check" size={14} color="#553fb5" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default QuestionnairesScreen;

/* ===== Styles ===== */
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f9fafc" },
  // Updated Hero Styles
  hero: {
    height: 250, // Fixed height to accommodate background and illustration
    paddingTop: 40, // Padding for status bar
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden", // Ensures the image respects the border radius
  },
  heroBgImage: {
    resizeMode: "cover",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.7)", // Slightly visible background for the icon
    marginBottom: 10,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginTop: -20, // Adjust this to position the image perfectly relative to the curve
  },
  // ... Rest of styles kept same
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 20, // Added some top padding since header text is gone
    marginBottom: 0,
  },
  progressIndicator: {
    height: 5,
    backgroundColor: "#F3E8FF",
    borderRadius: 3,
    marginBottom: 0,
    marginTop: 6,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#7C3AED",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: "#7C3AED",
    textAlign: "left",
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 18,
  },
  activeCardWrapper: {
    alignSelf: "center",
    width: "92%",
    marginTop: 12,
  },
  accordionItem: {
    backgroundColor: "#fff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#F3E8FF",
    shadowColor: "#7C3AED",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 22,
    paddingBottom: 0,
  },
  questionText: {
    fontSize: 16,
    color: "#1e293b",
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 0,
  },
  optionsWrap: {
    paddingHorizontal: 22,
    paddingBottom: 22,
    flexDirection: "column",
    gap: 12,
    marginTop: 20,
  },
  optionCard: {
    width: "100%",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Fixed from previous snippet
    shadowColor: "#7C3AED",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 0,
  },
  optionCardSelected: {
    backgroundColor: "#F3E8FF",
    borderColor: "#7C3AED",
  },
  optionText: {
    color: "#1e293b",
    fontSize: 15,
    fontWeight: "500",
    maxWidth: "90%",
    letterSpacing: 0.1,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  navPrev: { backgroundColor: "#f1f5f9" },
  navPrevPressed: { backgroundColor: "#d1d5db" },
  navNext: { backgroundColor: "#553fb5" },
  navNextPressed: { backgroundColor: "#3b2c85" },
  navDisabled: { opacity: 0.5 },
  navPrevText: { color: "#64748b" },
  navNextText: { color: "#fff" },
  questionNumWrap: { marginRight: 16 },
  questionNum: {
    backgroundColor: "rgba(99,102,241,0.1)",
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  answerIndicator: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#10b981",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  bottomTray: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    padding: 16,
    flexDirection: "row-reverse",
    gap: 16,
    justifyContent: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#553fb5",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText: { color: "#fff", fontSize: 14 },
  secondaryBtn: { backgroundColor: "#f1f5f9" },
  secondaryBtnText: { color: "#64748b" },
  questionNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginVertical: 24,
  },
});