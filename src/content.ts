export const clinic = {
  name: 'AGAI Physiotherapy Centre',
  founder: 'Dr. Rasathi Rajendren, PT',
  // Add only verified clinic details. Keep unavailable values empty.
  phone: '+91 96000 66505',
  whatsapp: '919600066505', // International number with country code, digits only.
  email: 'agaiphysiorehab@gmail.com',
  address: 'Ambattur, Chennai – 600058',
  mapsUrl: 'https://maps.app.goo.gl/HXLyiWfbT9M8eqJq6',
  mapsEmbedUrl: 'https://maps.google.com/maps?ll=13.0967021,80.1437204&z=17&output=embed',
  hours: '',
}

export const categories = [
  { id: 'all', label: 'All services' },
  { id: 'sports', label: 'Sports & performance' },
  { id: 'rehabilitation', label: 'Rehabilitation' },
  { id: 'wellness', label: 'Women’s wellness' },
  { id: 'ageing', label: 'Healthy ageing' },
] as const

export const services = [
  {
    id: 'sports-injury', category: 'sports', icon: 'activity',
    image: '/images/services/big-cards/01-sports-injury-rehabilitation.webp',
    previewImage: '/images/services/small-cards/01-sports-injury-rehabilitation.webp',
    title: 'Sports injury prevention & rehabilitation', shortTitle: 'Sports injury rehabilitation',
    intro: 'For an injury that is keeping you away from sport or exercise.',
    description: 'We assess how your injury affects movement and plan rehabilitation around the activity you want to return to.',
    forYou: 'A sprain, strain or sports injury is limiting training, exercise or play.',
    focus: ['Understanding your injury and movement', 'Rebuilding strength and control', 'Planning a gradual return to activity'],
  },
  {
    id: 'strength-conditioning', category: 'sports', icon: 'strength',
    image: '/images/services/big-cards/02-strength-and-conditioning.webp',
    previewImage: '/images/services/small-cards/02-strength-and-conditioning.webp',
    title: 'Speed, strength & conditioning', shortTitle: 'Strength & conditioning',
    intro: 'For building strength, stamina and confidence in exercise.',
    description: 'Purposeful exercise programmes centred on speed, strength and physical conditioning, with your individual goals guiding the approach.',
    forYou: 'You want a structured exercise plan suited to your fitness or sporting goals.',
    focus: ['Exercises suited to your starting point', 'Strength and stamina training', 'Progressing towards your activity goals'],
  },
  {
    id: 'orthopaedic', category: 'rehabilitation', icon: 'joint',
    image: '/images/services/big-cards/03-orthopaedic-rehabilitation.webp',
    previewImage: '/images/services/small-cards/03-orthopaedic-rehabilitation.webp',
    title: 'Orthopaedic rehabilitation', shortTitle: 'Orthopaedic rehabilitation',
    intro: 'For back, neck or joint pain, stiffness and recovery after surgery.',
    description: 'Care for problems affecting muscles, bones and joints. We assess your movement and discuss exercises, advice and hands-on care where appropriate.',
    forYou: 'Pain or stiffness makes sitting, bending, lifting or climbing stairs difficult, or you need rehabilitation after surgery.',
    focus: ['Understanding what makes movement difficult', 'Exercises for mobility and strength', 'Support with everyday activities'],
  },
  {
    id: 'neurological', category: 'rehabilitation', icon: 'brain',
    image: '/images/services/big-cards/04-neurological-rehabilitation.webp',
    previewImage: '/images/services/small-cards/04-neurological-rehabilitation.webp',
    title: 'Neurological rehabilitation', shortTitle: 'Neurological rehabilitation',
    intro: 'For movement and balance difficulties linked to a neurological condition.',
    description: 'Rehabilitation for people whose movement is affected by conditions involving the brain, spinal cord or nerves, including recovery after a stroke.',
    forYou: 'An existing neurological condition is affecting your walking, balance or daily tasks.',
    focus: ['Practising movements used in daily life', 'Working on balance and coordination', 'Setting achievable rehabilitation goals'],
  },
  {
    id: 'womens-wellness', category: 'wellness', icon: 'leaf',
    image: '/images/services/big-cards/05-womens-fitness-and-wellness.webp',
    previewImage: '/images/services/small-cards/05-womens-fitness-and-wellness.webp',
    title: 'Women’s clinical fitness & wellness', shortTitle: 'Women’s fitness & wellness',
    intro: 'For movement, strength and exercise support through different life stages.',
    description: 'Individual physiotherapy and exercise guidance for women, including during pregnancy and after childbirth, based on an assessment of your needs.',
    forYou: 'You want help with movement or a supported return to exercise during or after pregnancy.',
    focus: ['Discussing your comfort and activity goals', 'Exercises adapted to your needs', 'Support during and after pregnancy'],
  },
  {
    id: 'pelvic-floor', category: 'wellness', icon: 'flower',
    image: '/images/services/big-cards/06-pelvic-floor-rehabilitation.webp',
    previewImage: '/images/services/small-cards/06-pelvic-floor-rehabilitation.webp',
    title: 'Pelvic floor rehabilitation', shortTitle: 'Pelvic floor rehabilitation',
    intro: 'For concerns such as bladder leakage or pelvic floor weakness.',
    description: 'A sensitive, individual assessment helps us understand your concerns and discuss whether pelvic floor exercises and guidance may help.',
    forYou: 'Bladder leakage or concerns about pelvic floor strength are affecting your comfort or confidence.',
    focus: ['Time to discuss your concerns', 'Understanding pelvic floor function', 'An individual exercise and care plan'],
  },
  {
    id: 'geriatric', category: 'ageing', icon: 'person',
    image: '/images/services/big-cards/07-geriatric-rehabilitation.webp',
    previewImage: '/images/services/small-cards/07-geriatric-rehabilitation.webp',
    title: 'Geriatric rehabilitation', shortTitle: 'Geriatric rehabilitation',
    intro: 'For older adults finding walking, balance or everyday movement harder.',
    description: 'Care focused on the movements that support daily independence, with exercises adapted to your abilities and goals.',
    forYou: 'Getting up from a chair, walking or keeping your balance has become more difficult as you get older.',
    focus: ['Strength for everyday tasks', 'Walking and balance practice', 'Building confidence with movement'],
  },
] as const

export const careNeeds = [
  { title: 'Pain or stiffness', description: 'Back, neck or joint discomfort is making sitting, bending or everyday tasks harder.', icon: 'joint', serviceId: 'orthopaedic', linkLabel: 'Explore pain and joint care' },
  { title: 'An injury or recent surgery', description: 'You need guidance to rebuild movement and strength during recovery.', icon: 'activity', serviceId: 'orthopaedic', linkLabel: 'Explore rehabilitation' },
  { title: 'Getting back to sport', description: 'An injury is keeping you away from training or the activities you enjoy.', icon: 'strength', serviceId: 'sports-injury', linkLabel: 'Explore sports injury care' },
  { title: 'Changes during or after pregnancy', description: 'You want support with movement, strength or returning to exercise.', icon: 'leaf', serviceId: 'womens-wellness', linkLabel: 'Explore women’s care' },
  { title: 'Walking or balance feels harder', description: 'You are finding everyday movement more difficult as you get older.', icon: 'person', serviceId: 'geriatric', linkLabel: 'Explore care for older adults' },
  { title: 'Movement after a stroke', description: 'You need rehabilitation support with walking, coordination or daily activities.', icon: 'brain', serviceId: 'neurological', linkLabel: 'Explore neurological care' },
] as const

export const approach = [
  { title: 'Tell us what is difficult', text: 'Share your symptoms, relevant health history and the activities you want to get back to.' },
  { title: 'Understand your movement', text: 'Your physiotherapist assesses movement, strength and balance as needed, then explains the findings.' },
  { title: 'Agree on a plan together', text: 'Discuss your options, set realistic goals and learn exercises or advice suited to your daily routine.' },
]

export const faqs = [
  { question: 'Is AGAI only for athletes?', answer: 'No. Alongside sports rehabilitation and conditioning, AGAI offers orthopaedic and neurological rehabilitation, women’s fitness and wellness, pelvic floor rehabilitation and care for older adults.' },
  { question: 'When should I consider physiotherapy?', answer: 'If pain, stiffness, an injury or difficulty moving is affecting everyday activities, a physiotherapy assessment can help you understand your options. You can also ask about rehabilitation after surgery or support with returning to activity.' },
  { question: 'Who will guide my care?', answer: 'Dr. Rasathi Rajendren, PT, is the founder and sports physiotherapist at AGAI. She will discuss your concerns and plan care around your needs and goals.' },
  { question: 'How is my rehabilitation programme planned?', answer: 'The approach combines clinical assessment, hands-on therapy, individualised exercise programmes and patient education. Your needs and movement goals guide the plan.' },
  { question: 'What if I am unsure which service to choose?', answer: 'You can explain your question in your own words in the contact enquiry form. You do not need to choose a specific rehabilitation service before making an enquiry.' },
]
