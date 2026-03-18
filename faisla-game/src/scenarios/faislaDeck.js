// Core Scenario Engine deck for Faisla.
// This stays fully local and is loaded once on app start.

/**
 * @typedef {Object} PillarEffects
 * @property {number} family
 * @property {number} crops
 * @property {number} finance
 * @property {number} resilience
 */

/**
 * @typedef {Object} CardChoice
 * @property {string} label
 * @property {string} description
 */

/**
 * @typedef {Object} FaislaCard
 * @property {string} id
 * @property {'pre_sowing'|'sowing'|'growing'|'harvest'|'off_season'} seasonPhase
 * @property {string} title
 * @property {string} prompt
 * @property {string=} prompt_hi   Hindi translation of prompt
 * @property {string=} prompt_ta   Tamil translation of prompt
 * @property {CardChoice} left
 * @property {CardChoice} right
 * @property {PillarEffects} effectsLeft
 * @property {PillarEffects} effectsRight
 * @property {('elder'|'bank_mitr'|'scammer'|'self')} narrator
 * @property {string[]} tags
 * @property {string=} audioKey
 * @property {boolean=} endGame
 * @property {boolean=} triggerDebtTrap
 */

/** @type {FaislaCard[]} */
export const faislaDeck = [
  {
    id: 'loan_informal_vs_bank',
    seasonPhase: 'pre_sowing',
    title: 'Money for Seeds',
    prompt:
      'You need ₹40,000 for seeds and fertilizer. The village moneylender offers instant cash at 5% per month. The bank loan needs paperwork and a week of waiting.',
    prompt_hi:
      'आपको बीज और खाद के लिए ₹40,000 चाहिए। गाँव का साहूकार 5% प्रति माह पर तुरंत नकद देता है। बैंक ऋण के लिए कागज़ात और एक हफ्ते का इंतज़ार करना होगा।',
    prompt_ta:
      'உங்களுக்கு விதைகள் மற்றும் உரத்திற்கு ₹40,000 தேவை. கிராம கடன்காரர் மாதம் 5% வட்டியில் உடனடியாக பணம் தருகிறார். வங்கி கடனுக்கு ஆவணங்களும் ஒரு வாரம் காத்திருக்கவும் வேண்டும்.',
    left: {
      label: 'Take fast money from sahukar',
      description: 'No delay, but very high interest and pressure.',
    },
    right: {
      label: 'Wait for KCC/bank loan',
      description: 'Slower, but regulated interest and protections.',
    },
    effectsLeft:  { family: 5,   crops: 10, finance: -20, resilience: -10 },
    effectsRight: { family: -5,  crops: 0,  finance: 10,  resilience: 15  },
    narrator: 'bank_mitr',
    tags: ['debt', 'credit', 'planning'],
    triggerDebtTrap: true,
    audioKey: 'pre_sowing.loan_choice',
  },
  {
    id: 'crop_insurance',
    seasonPhase: 'sowing',
    title: 'Crop Insurance Premium',
    prompt:
      'The krishi officer suggests buying crop insurance before sowing. Premium is ₹800 per acre. Last year you skipped it and monsoon was on time.',
    prompt_hi:
      'कृषि अधिकारी बुवाई से पहले फसल बीमा खरीदने का सुझाव देता है। प्रीमियम ₹800 प्रति एकड़ है। पिछले साल आपने इसे छोड़ दिया था और मानसून समय पर आया था।',
    prompt_ta:
      'விவசாய அதிகாரி விதைப்பதற்கு முன் பயிர் காப்பீடு வாங்க பரிந்துரைக்கிறார். பிரீமியம் ஏக்கருக்கு ₹800. கடந்த ஆண்டு நீங்கள் தவிர்த்தீர்கள், மழையும் சரியான நேரத்தில் வந்தது.',
    left: {
      label: 'Skip insurance, save money',
      description: 'Hope that weather stays normal again.',
    },
    right: {
      label: 'Pay premium, stay covered',
      description: 'Small cost now to avoid big loss later.',
    },
    effectsLeft:  { family: 5, crops: 0,  finance: 5,  resilience: -20 },
    effectsRight: { family: 0, crops: 0,  finance: -5, resilience: 15  },
    narrator: 'elder',
    tags: ['insurance', 'risk'],
    audioKey: 'sowing.insurance',
  },
  {
    id: 'fraud_otp_call',
    seasonPhase: 'growing',
    title: 'Fraud Call: Kisan Subsidy',
    prompt:
      'You get a call saying your Kisan subsidy will stop unless you share your ATM OTP "for verification". The caller sounds urgent and official.',
    prompt_hi:
      'आपको एक कॉल आती है जिसमें कहा जाता है कि जब तक आप "सत्यापन के लिए" अपना ATM OTP नहीं देते, आपकी किसान सब्सिडी बंद हो जाएगी। कॉलर की आवाज़ तत्काल और आधिकारिक लगती है।',
    prompt_ta:
      'உங்கள் கிசான் மானியம் நிறுத்தப்படும் என்று ஒரு அழைப்பு வருகிறது, "சரிபார்ப்புக்காக" ATM OTP கொடுக்க வேண்டும் என்கிறார்கள். அழைப்பாளர் அவசரமாகவும் அதிகாரப்பூர்வமாகவும் பேசுகிறார்.',
    left: {
      label: 'Share OTP to keep subsidy',
      description: 'Trust the caller and protect the money.',
    },
    right: {
      label: 'Cut the call, visit bank',
      description: 'Never share OTP on phone.',
    },
    effectsLeft:  { family: -25, crops: -5, finance: -30, resilience: -15 },
    effectsRight: { family: 5,   crops: 0,  finance: 10,  resilience: 20  },
    narrator: 'scammer',
    tags: ['fraud_call', 'digital_safety'],
    audioKey: 'growing.fraud_otp',
    triggerDebtTrap: true,
  },
  {
    id: 'mandi_low_price',
    seasonPhase: 'harvest',
    title: 'Mandi Prices Crash',
    prompt:
      'Mandi price this week is very low due to oversupply. You can sell now or wait 2 weeks, but must arrange storage.',
    prompt_hi:
      'इस हफ्ते मंडी में अधिक आपूर्ति के कारण भाव बहुत कम है। आप अभी बेच सकते हैं या 2 हफ्ते इंतज़ार कर सकते हैं, लेकिन भंडारण की व्यवस्था करनी होगी।',
    prompt_ta:
      'இந்த வாரம் அதிக விநியோகம் காரணமாக மண்டி விலை மிகவும் குறைவாக உள்ளது. இப்போது விற்கலாம் அல்லது 2 வாரங்கள் காத்திருக்கலாம், ஆனால் சேமிப்பு ஏற்பாடு செய்ய வேண்டும்.',
    left: {
      label: 'Sell immediately at low price',
      description: 'Clear stock, avoid storage risk.',
    },
    right: {
      label: 'Store grain, wait for better rate',
      description: 'Spend on storage hoping prices recover.',
    },
    effectsLeft:  { family: 0, crops: 0,  finance: -10, resilience: -5 },
    effectsRight: { family: 0, crops: -5, finance: 10,  resilience: 5  },
    narrator: 'self',
    tags: ['mandi', 'price_fluctuation'],
    audioKey: 'harvest.mandi_price',
  },
  {
    id: 'festival_spend_vs_savings',
    seasonPhase: 'off_season',
    title: 'Festival Spending',
    prompt:
      'Festival season is here. Children want new clothes and sweets. You planned to keep ₹10,000 aside for next season input cost.',
    prompt_hi:
      'त्योहार का मौसम आ गया है। बच्चे नए कपड़े और मिठाई चाहते हैं। आपने अगले सीज़न की लागत के लिए ₹10,000 अलग रखने की योजना बनाई थी।',
    prompt_ta:
      'திருவிழா காலம் வந்துவிட்டது. குழந்தைகள் புதிய ஆடைகளும் இனிப்புகளும் வேண்டும் என்கிறார்கள். அடுத்த சீசன் செலவுக்காக ₹10,000 ஒதுக்க திட்டமிட்டிருந்தீர்கள்.',
    left: {
      label: 'Spend most savings on festival',
      description: 'Make family happy today, worry later.',
    },
    right: {
      label: 'Limit spending, protect savings',
      description: 'Celebrate simply, secure next season.',
    },
    effectsLeft:  { family: 20, crops: 0, finance: -20, resilience: -10 },
    effectsRight: { family: -5, crops: 0, finance: 15,  resilience: 10  },
    narrator: 'elder',
    tags: ['savings', 'consumption'],
    audioKey: 'off_season.festival',
  },
  {
    id: 'health_emergency',
    seasonPhase: 'growing',
    title: 'Health Emergency at Home',
    prompt:
      'Your father suddenly falls ill. Private hospital asks for a large advance. Government hospital is farther and crowded but much cheaper.',
    prompt_hi:
      'आपके पिता अचानक बीमार पड़ जाते हैं। प्राइवेट अस्पताल बड़ी अग्रिम राशि माँगता है। सरकारी अस्पताल दूर और भीड़भाड़ वाला है लेकिन बहुत सस्ता है।',
    prompt_ta:
      'உங்கள் தந்தை திடீரென்று நோய்வாய்ப்படுகிறார். தனியார் மருத்துவமனை பெரிய முன்பணம் கேட்கிறது. அரசு மருத்துவமனை தூரத்தில் இருக்கிறது, நெரிசலாக இருக்கும், ஆனால் மிகவும் மலிவானது.',
    left: {
      label: 'Go to private hospital now',
      description: 'Best care, but big bill and maybe loans.',
    },
    right: {
      label: 'Use govt hospital, manage delay',
      description: 'Cheaper, but more stress and waiting.',
    },
    effectsLeft:  { family: 15, crops: -5, finance: -25, resilience: -10 },
    effectsRight: { family: 0,  crops: 0,  finance: 5,   resilience: 10  },
    narrator: 'self',
    tags: ['health', 'shock_expense'],
  },
  {
    id: 'monsoon_delay',
    seasonPhase: 'sowing',
    title: 'Monsoon Delay',
    prompt:
      'Rain is delayed by two weeks. You can still sow high-risk, high-yield crop or switch to a more resilient but lower-profit variety.',
    prompt_hi:
      'बारिश दो हफ्ते देर से आ रही है। आप अभी भी अधिक जोखिम वाली, अधिक उपज देने वाली फसल बो सकते हैं या कम मुनाफे वाली लेकिन अधिक मज़बूत किस्म पर स्विच कर सकते हैं।',
    prompt_ta:
      'மழை இரண்டு வாரங்கள் தாமதமாகிறது. அதிக ஆபத்து, அதிக மகசூல் தரும் பயிரை விதைக்கலாம் அல்லது குறைந்த லாபம் ஆனால் அதிக நிலைத்தன்மை கொண்ட வகைக்கு மாறலாம்.',
    left: {
      label: 'Stick to high-risk crop',
      description: 'Chase higher profit despite delay.',
    },
    right: {
      label: 'Switch to resilient crop',
      description: 'Accept lower profit for stability.',
    },
    effectsLeft:  { family: 0, crops: -20, finance: 15,  resilience: -10 },
    effectsRight: { family: 0, crops: 10,  finance: -5,  resilience: 15  },
    narrator: 'elder',
    tags: ['monsoon', 'risk'],
  },
  {
    id: 'input_shop_credit',
    seasonPhase: 'pre_sowing',
    title: 'Input Shop Credit',
    prompt:
      'Local agri shop offers seeds and fertilizer on "udhaar" if you promise to sell harvest through them at a fixed lower price.',
    prompt_hi:
      'स्थानीय कृषि दुकान "उधार" पर बीज और खाद देती है, अगर आप उनके माध्यम से तय कम कीमत पर फसल बेचने का वादा करें।',
    prompt_ta:
      'உள்ளூர் விவசாய கடை "உதார்" முறையில் விதைகளும் உரமும் தருகிறது, நீங்கள் அவர்கள் மூலம் நிர்ணயிக்கப்பட்ட குறைந்த விலையில் அறுவடையை விற்க வேண்டும் என்று வாக்குறுதி கொடுத்தால்.',
    left: {
      label: 'Accept shop credit tie-up',
      description: 'Easy inputs now, less freedom later.',
    },
    right: {
      label: 'Arrange cash elsewhere',
      description: 'More effort now, more options later.',
    },
    effectsLeft:  { family: 5,  crops: 5, finance: -15, resilience: -5  },
    effectsRight: { family: -5, crops: 0, finance: 10,  resilience: 10  },
    narrator: 'bank_mitr',
    tags: ['debt', 'market_access'],
  },
  {
    id: 'self_help_group',
    seasonPhase: 'off_season',
    title: 'Join Self Help Group',
    prompt:
      'Women in your family are invited to a Self Help Group that encourages small monthly savings and gives low-interest loans.',
    prompt_hi:
      'आपके परिवार की महिलाओं को एक स्वयं सहायता समूह में आमंत्रित किया गया है जो छोटी मासिक बचत को प्रोत्साहित करता है और कम ब्याज पर ऋण देता है।',
    prompt_ta:
      'உங்கள் குடும்பத்தில் உள்ள பெண்கள் ஒரு சுய உதவி குழுவில் சேர அழைக்கப்படுகிறார்கள், இது சிறிய மாதாந்திர சேமிப்பை ஊக்குவிக்கிறது மற்றும் குறைந்த வட்டியில் கடன் தருகிறது.',
    left: {
      label: 'Ignore SHG, keep cash at home',
      description: 'Avoid meetings and paperwork.',
    },
    right: {
      label: 'Join SHG and start saving',
      description: 'Build small buffer and credit history.',
    },
    effectsLeft:  { family: 0,  crops: 0, finance: -5, resilience: -10 },
    effectsRight: { family: 10, crops: 0, finance: 10, resilience: 15  },
    narrator: 'bank_mitr',
    tags: ['savings', 'formal_credit'],
  },
  {
    id: 'end_of_year_review',
    seasonPhase: 'off_season',
    title: 'Year-End Review',
    prompt:
      'You look back at the whole year. Did savings grow? Are debts under control? Did the family feel secure?',
    prompt_hi:
      'आप पूरे साल पर नज़र डालते हैं। क्या बचत बढ़ी? क्या कर्ज़ नियंत्रण में है? क्या परिवार सुरक्षित महसूस करता है?',
    prompt_ta:
      'நீங்கள் முழு ஆண்டையும் திரும்பிப் பார்க்கிறீர்கள். சேமிப்பு வளர்ந்ததா? கடன்கள் கட்டுப்பாட்டில் உள்ளதா? குடும்பம் பாதுகாப்பாக உணர்ந்ததா?',
    left: {
      label: 'Ignore and repeat same pattern',
      description: 'Do not change anything next year.',
    },
    right: {
      label: 'Plan budget for next season',
      description: 'Write simple plan for expenses and savings.',
    },
    effectsLeft:  { family: -10, crops: 0, finance: -10, resilience: -15 },
    effectsRight: { family: 10,  crops: 0, finance: 10,  resilience: 15  },
    narrator: 'self',
    tags: ['planning', 'reflection'],
    endGame: true,
  },
]

export function getShuffledDeck() {
  const copy = [...faislaDeck]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
