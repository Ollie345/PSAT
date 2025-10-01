class MenopauseAssessmentBot:
    def __init__(self):
        self.symptoms = {
            "hot_flashes": {"question": "Have you been experiencing hot flashes or night sweats?", "score": 3},
            "irregular_periods": {"question": "Have your menstrual periods become irregular or stopped?", "score": 4},
            "sleep_issues": {"question": "Have you been having trouble sleeping through the night?", "score": 2},
            "mood_changes": {"question": "Have you noticed significant mood swings or irritability?", "score": 2},
            "vaginal_dryness": {"question": "Have you experienced vaginal dryness or discomfort during intercourse?", "score": 2},
            "libido_changes": {"question": "Have you noticed changes in your sexual desire?", "score": 1},
            "memory_focus": {"question": "Have you had problems with memory or concentration?", "score": 1},
            "weight_changes": {"question": "Have you experienced unexplained weight gain, especially around the abdomen?", "score": 1},
            "hair_changes": {"question": "Have you noticed thinning hair or dry skin?", "score": 1},
            "joint_pain": {"question": "Have you been experiencing joint pain or stiffness?", "score": 1}
        }
    
    def calculate_score(self, responses):
        total_score = 0
        for symptom, response in responses.items():
            if symptom in self.symptoms and response in ['yes', 'sometimes']:
                score_multiplier = 1 if response == 'sometimes' else 1
                total_score += self.symptoms[symptom]['score'] * score_multiplier
        return total_score
    
    def generate_assessment(self, total_score, age):
        if total_score == 0:
            return {
                "stage": "No symptoms",
                "message": "You're not reporting any common menopausal symptoms.",
                "detailed_message": "Based on your responses, you don't appear to be experiencing typical menopause symptoms at this time."
            }
        elif total_score <= 5:
            return {
                "stage": "Mild symptoms",
                "message": "You're reporting some mild symptoms that could be related to perimenopause.",
                "detailed_message": "These might be worth discussing with your healthcare provider if they concern you."
            }
        elif total_score <= 10:
            return {
                "stage": "Perimenopause/Early menopause",
                "message": "You're reporting several symptoms commonly associated with menopause.",
                "detailed_message": "This suggests you may be in perimenopause or early menopause. Consider consulting with a healthcare provider about managing these symptoms."
            }
        else:
            return {
                "stage": "Significant menopausal symptoms",
                "message": "You're reporting multiple significant menopausal symptoms.",
                "detailed_message": "This strongly suggests you may be experiencing menopause. A healthcare provider can help confirm this and discuss treatment options."
            }

# Example usage for testing
if __name__ == "__main__":
    bot = MenopauseAssessmentBot()
    
    # Test responses
    test_responses = {
        "hot_flashes": "yes",
        "irregular_periods": "sometimes",
        "sleep_issues": "no",
        "mood_changes": "yes"
    }
    
    score = bot.calculate_score(test_responses)
    assessment = bot.generate_assessment(score, 45)
    
    print(f"Score: {score}")
    print(f"Assessment: {assessment}")
