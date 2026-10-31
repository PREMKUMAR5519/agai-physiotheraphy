export const clinic = {
  name: 'AGAI Physiotherapy Centre',
  founder: 'Dr. Rasathi Rajendren, PT',
  // Add only verified clinic details. Keep unavailable values empty.
  phone: '+91 96000 66505',
  whatsapp: '919600066505', // International number with country code, digits only.
  email: 'agaiphysiorehab@gmail.com',
  address: 'Ambattur, Chennai – 600058',
  mapsUrl: 'https://maps.app.goo.gl/HXLyiWfbT9M8eqJq6',
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
    image: '/images/services/01-sports-injury-rehabilitation.png',
    title: 'Sports injury prevention & rehabilitation', shortTitle: 'Sports injury rehabilitation',
    intro: 'Get back to the movement that matters to you.',
    description: 'Care for active individuals and athletes, with a focus on understanding movement, rehabilitating injuries and supporting a return to sporting activity.',
    focus: ['Clinical movement assessment', 'Individualised rehabilitation', 'Injury prevention and education'],
  },
  {
    id: 'strength-conditioning', category: 'sports', icon: 'strength',
    image: '/images/services/02-strength-and-conditioning.png',
    title: 'Speed, strength & conditioning', shortTitle: 'Strength & conditioning',
    intro: 'Build a stronger foundation for performance.',
    description: 'Purposeful exercise programmes centred on speed, strength and physical conditioning, with your individual goals guiding the approach.',
    focus: ['Strength development', 'Speed and conditioning', 'Individual performance goals'],
  },
  {
    id: 'orthopaedic', category: 'rehabilitation', icon: 'joint',
    image: '/images/services/03-orthopaedic-rehabilitation.png',
    title: 'Orthopaedic rehabilitation', shortTitle: 'Orthopaedic rehabilitation',
    intro: 'Support for everyday movement and function.',
    description: 'Rehabilitation focused on musculoskeletal movement and function. Clinical assessment, hands-on therapy and individualised exercise inform your care.',
    focus: ['Movement and functional assessment', 'Individualised exercise', 'Rehabilitation and patient education'],
  },
  {
    id: 'neurological', category: 'rehabilitation', icon: 'brain',
    image: '/images/services/04-neurological-rehabilitation.png',
    title: 'Neurological rehabilitation', shortTitle: 'Neurological rehabilitation',
    intro: 'Work towards meaningful movement goals.',
    description: 'An individual approach to rehabilitation for people with neurological conditions, shaped around functional movement and everyday goals.',
    focus: ['Functional movement', 'Individual rehabilitation goals', 'Patient education and support'],
  },
  {
    id: 'womens-wellness', category: 'wellness', icon: 'leaf',
    image: '/images/services/05-womens-fitness-and-wellness.png',
    title: 'Women’s clinical fitness & wellness', shortTitle: 'Women’s fitness & wellness',
    intro: 'Care that makes space for your needs.',
    description: 'Personalised physiotherapy and exercise for women’s wellness, informed by the founder’s clinical experience in women’s health and pre- and postpartum rehabilitation.',
    focus: ['Women’s health and movement', 'Individualised exercise programmes', 'Pre- and postpartum rehabilitation'],
  },
  {
    id: 'pelvic-floor', category: 'wellness', icon: 'flower',
    image: '/images/services/06-pelvic-floor-rehabilitation.png',
    title: 'Pelvic floor rehabilitation', shortTitle: 'Pelvic floor rehabilitation',
    intro: 'A thoughtful, individual approach to care.',
    description: 'Pelvic floor rehabilitation with a focus on understanding your needs and developing an individual approach to exercise and education.',
    focus: ['Individual assessment', 'Personalised rehabilitation', 'Education and movement awareness'],
  },
  {
    id: 'geriatric', category: 'ageing', icon: 'person',
    image: '/images/services/07-geriatric-rehabilitation.png',
    title: 'Geriatric rehabilitation', shortTitle: 'Geriatric rehabilitation',
    intro: 'Keep everyday movement at the centre.',
    description: 'Rehabilitation for older adults, with a focus on functional movement, strength and the activities that matter in daily life.',
    focus: ['Everyday functional movement', 'Individual exercise programmes', 'Strength and movement confidence'],
  },
] as const

export const approach = [
  { title: 'Understand your movement', text: 'Clinical assessment starts with your movement, your needs and what you want to work towards.' },
  { title: 'Make your care personal', text: 'Hands-on therapy and individualised exercise programmes bring purpose to your rehabilitation.' },
  { title: 'Build beyond recovery', text: 'Patient education and a focus on strength support your movement beyond the treatment session.' },
]

export const faqs = [
  { question: 'Is AGAI only for athletes?', answer: 'No. Alongside sports rehabilitation and conditioning, AGAI offers orthopaedic and neurological rehabilitation, women’s fitness and wellness, pelvic floor rehabilitation and care for older adults.' },
  { question: 'Who will guide my care?', answer: 'The centre is founded by Dr. Rasathi Rajendren, PT, a sports physiotherapist with an MPT in Sports Physiotherapy and over 10 years of clinical experience across India and the Middle East.' },
  { question: 'How is my rehabilitation programme planned?', answer: 'The approach combines clinical assessment, hands-on therapy, individualised exercise programmes and patient education. Your needs and movement goals guide the plan.' },
  { question: 'What if I am unsure which service to choose?', answer: 'You can select “Not sure yet” in the contact enquiry form and explain your question in your own words. You do not need to choose a specific rehabilitation service before making an enquiry.' },
]
