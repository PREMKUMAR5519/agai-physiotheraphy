export const blogTopics = ['All articles', 'Getting started', 'Movement goals', 'Everyday wellbeing'] as const

export const blogArticles = [
  {
    slug: 'your-first-physiotherapy-visit', category: 'Getting started',
    title: 'Your first visit. A little clarity before you arrive.',
    excerpt: 'What to bring, what to ask, and how to make space for a conversation about your care.',
    image: '/images/blog/default-covver-pic.jpg',
    imageAlt: '',
    sections: [
      { heading: 'Start with your story', text: 'You do not need the perfect words to explain why you are coming in. Think about what brought you here, the activities you would like to get back to, and the questions you want to ask. A few notes on your phone or a piece of paper can help you remember what matters to you.' },
      { heading: 'Bring what helps the conversation', text: 'If you have existing reports, referral letters or information about previous treatment, keep them together so you can discuss them with your physiotherapist. Ask the clinic beforehand if there is anything specific to bring or wear for your appointment.' },
      { heading: 'Leave room for questions', text: 'You can ask what the next steps involve, how appointments are arranged and who to contact between visits. Before you leave, check that you understand any instructions you have been given. It is always okay to ask for something to be explained again.' },
    ],
  },
  {
    slug: 'movement-goals-that-mean-something', category: 'Movement goals',
    title: 'What does moving well mean to you?',
    excerpt: 'From a favourite walk to a weekend game, start with the things you want to return to.',
    image: '/images/blog/default-covver-pic.jpg', imageAlt: '',
    sections: [
      { heading: 'Make it personal', text: 'A movement goal can be an ordinary part of your day: getting out with friends, enjoying a hobby or returning to a familiar routine. Write down the activity you miss and why it is important to you. This gives your care team a useful starting point for a conversation.' },
      { heading: 'Describe the whole activity', text: 'Share the details around your goal, such as where it happens, how often you do it and what you find difficult. Your physiotherapist can discuss which details matter for your individual care. You do not need to arrive with your own exercise plan.' },
      { heading: 'Keep the conversation open', text: 'Priorities can change. Bring up new goals or questions at your next appointment, and ask how they fit with the plan you have discussed. A clear conversation helps you and your care team stay focused on what matters to you.' },
    ],
  },
  {
    slug: 'questions-to-ask-your-physiotherapist', category: 'Getting started',
    title: 'Five questions worth bringing to your appointment.',
    excerpt: 'A simple starting point for a clearer, more confident conversation with your care team.',
    image: '/images/blog/default-covver-pic.jpg', imageAlt: '',
    sections: [
      { heading: 'Understand the plan', text: 'Start with two questions: “What are we working towards?” and “What will the next steps involve?” Ask for an explanation in everyday language if a term is unfamiliar. You can also ask for a written summary of any instructions.' },
      { heading: 'Talk about everyday life', text: 'A third useful question is: “How does this fit with my usual routine?” Describe your work, responsibilities and the activities you enjoy. Your clinician can discuss your circumstances with you instead of leaving you to guess how a plan fits your day.' },
      { heading: 'Know how to follow up', text: 'Finish with: “When should we review the plan?” and “Who should I contact if I have questions?” Keep the contact details somewhere easy to find. If you are unsure about an instruction, ask your care team to clarify it.' },
    ],
  },
  {
    slug: 'planning-your-return-to-sport-conversation', category: 'Movement goals',
    title: 'Your sport. Your goals. Your next conversation.',
    excerpt: 'The details to share when discussing a return to the activities you love.',
    image: '/images/blog/default-covver-pic.jpg', imageAlt: '',
    sections: [
      { heading: 'Tell us about your sport', text: 'Share what you play, your usual schedule and what you enjoy most about taking part. A casual weekend game and a competitive season can mean different things to different people. Describe your own experience, including any deadlines you have in mind.' },
      { heading: 'Bring your questions, not a deadline to meet', text: 'Ask your physiotherapist how your individual circumstances will be considered and what a review will involve. A blog cannot decide when you are ready to return. Use the appointment to discuss your expectations and understand the next steps for you.' },
      { heading: 'Include the people who support you', text: 'If you would like a coach or family member to understand the plan, ask how information can be shared with your permission. Agreeing on who needs to know what can make your follow-up conversations easier to organise.' },
    ],
  },
  {
    slug: 'making-room-for-care-in-your-week', category: 'Everyday wellbeing',
    title: 'Make room for care in a busy week.',
    excerpt: 'A few practical ways to organise appointments around the rest of your life.',
    image: '/images/blog/default-covver-pic.jpg', imageAlt: '',
    sections: [
      { heading: 'Look at the practical details', text: 'Before choosing a preferred appointment time, consider your travel, work and family commitments. Give yourself enough room to get to the clinic without rushing. If you need information about access or the location, contact the team before your visit.' },
      { heading: 'Keep the essentials together', text: 'Save the clinic contact number and your appointment details in one place. Put any questions or documents you want to discuss with them. A short note is often easier to find than trying to remember everything on the day.' },
      { heading: 'Let the clinic know if plans change', text: 'If you need to rearrange a visit, contact the clinic to discuss your options. When requesting an appointment online, remember that your preferred date and time are a request; the team will confirm the appointment with you.' },
    ],
  },
  {
    slug: 'supporting-someone-at-their-appointment', category: 'Everyday wellbeing',
    title: 'Coming along? How to be a thoughtful support.',
    excerpt: 'Make space for the person receiving care while helping with the practical details.',
    image: '/images/blog/default-covver-pic.jpg', imageAlt: '',
    sections: [
      { heading: 'Ask what would be helpful', text: 'If you are accompanying a family member or friend, ask what support they would like. They may want help with travel, remembering questions or keeping appointment details organised. Let their preferences guide your role.' },
      { heading: 'Make space for their voice', text: 'Give the person receiving care room to describe their own goals and experiences. Ask before adding information or taking notes. You can check with the clinic in advance about bringing someone to the appointment.' },
      { heading: 'Agree on the practical next steps', text: 'Before leaving, check which details the person would like help remembering. This might include a follow-up date or a contact number. Any questions about care instructions should go back to the clinician for clarification.' },
    ],
  },
]

export type BlogArticle = typeof blogArticles[number]
export function readingMinutes(article: BlogArticle) {
  return Math.max(1, Math.ceil(article.sections.map(section => section.text).join(' ').split(/\s+/).length / 200))
}
