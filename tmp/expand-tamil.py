import json
from pathlib import Path
p=Path('src/tamil-main.json'); d=json.loads(p.read_text(encoding='utf8'))
lines='''WHEN TO VISIT|எப்போது வரலாம்?
Does this sound|இந்தச் சிரமங்கள்
familiar?|உங்களுக்கும் உள்ளனவா?
Physiotherapy may help when pain or difficulty moving gets in the way of your day. An assessment helps us understand your needs and discuss the right next step.|வலி அல்லது இயக்கச் சிரமம் உங்கள் அன்றாட வாழ்க்கையைப் பாதிக்கும்போது இயன்முறை மருத்துவம் உதவலாம். மதிப்பீட்டின் மூலம் உங்கள் தேவைகளைப் புரிந்துகொண்டு அடுத்த படியைத் திட்டமிடலாம்.
Care built around you|உங்களுக்கேற்ற சிகிச்சை
Start with a conversation about your movement, your comfort and what matters to you.|உங்கள் இயக்கம், உடல் சௌகரியம் மற்றும் உங்களுக்கு முக்கியமானவை குறித்த உரையாடலுடன் தொடங்குங்கள்.
Understand your needs. Find your next step.|உங்கள் தேவைகளைப் புரிந்துகொண்டு அடுத்த படியை அறியுங்கள்.
Find a care path|உங்களுக்கான சேவையைத் தேடுங்கள்
Search care paths|சேவைகளைத் தேடுங்கள்
Search your concern, e.g. back pain, pregnancy or balance…|உதாரணம்: முதுகு வலி, கர்ப்பகாலம், சமநிலை…
Find care|சேவையைத் தேடுங்கள்
Filter care paths|சேவைகளை வகைப்படுத்துங்கள்
All care paths|அனைத்து வகைகள்
Spine & joints|முதுகுத்தண்டு மற்றும் மூட்டுகள்
Everyday comfort|அன்றாடச் சௌகரியம்
Support for comfortable movement in everyday life.|அன்றாட வாழ்க்கையில் எளிதாக இயங்க உதவி.
Injury & surgery|காயம் மற்றும் அறுவைச் சிகிச்சை
Recovery|மீட்சி
Movement & strength|இயக்கம் மற்றும் வலிமை
Rebuilding movement and strength during recovery.|மீட்சியின்போது இயக்கத்தையும் வலிமையையும் மீட்டெடுத்தல்.
Sport & exercise|விளையாட்டு மற்றும் உடற்பயிற்சி
Return to sport|விளையாட்டுக்குத் திரும்புதல்
Active living|சுறுசுறுப்பான வாழ்க்கை
A gradual return to the activities you enjoy.|நீங்கள் விரும்பும் செயல்களுக்குப் படிப்படியாகத் திரும்புதல்.
Women’s health|பெண்களின் உடல்நலம்
Pregnancy & beyond|கர்ப்பகாலமும் அதற்குப் பிறகும்
Movement and exercise support through different life stages.|வாழ்க்கையின் பல்வேறு நிலைகளில் இயக்கம் மற்றும் உடற்பயிற்சிக்கான ஆதரவு.
Walking & balance|நடை மற்றும் சமநிலை
Balance|சமநிலை
Support with walking, balance and everyday movement.|நடை, சமநிலை மற்றும் அன்றாட இயக்கத்திற்கான ஆதரவு.
Neurological care|நரம்பியல் பராமரிப்பு
Coordination|ஒருங்கிணைப்பு
Daily activities|அன்றாடச் செயல்கள்
Working towards your movement and daily activity goals.|உங்கள் இயக்கம் மற்றும் அன்றாடச் செயல்பாட்டு இலக்குகளை நோக்கி முன்னேறுதல்.
Pain or stiffness|வலி அல்லது இறுக்கம்
Back, neck or joint discomfort is making sitting, bending or everyday tasks harder.|முதுகு, கழுத்து அல்லது மூட்டுப் பிரச்சினைகளால் உட்காருதல், குனிதல் அல்லது அன்றாடப் பணிகள் கடினமாக உள்ளன.
Explore pain and joint care|வலி மற்றும் மூட்டுகளுக்கான சேவைகளை அறியுங்கள்
An injury or recent surgery|காயம் அல்லது அண்மையில் செய்த அறுவைச் சிகிச்சை
You need guidance to rebuild movement and strength during recovery.|மீட்சியின்போது இயக்கத்தையும் வலிமையையும் மீட்டெடுக்க வழிகாட்டுதல் தேவை.
Explore rehabilitation|மறுவாழ்வுச் சேவைகளை அறியுங்கள்
Getting back to sport|விளையாட்டுக்குத் திரும்புதல்
An injury is keeping you away from training or the activities you enjoy.|காயம் காரணமாகப் பயிற்சி அல்லது விருப்பமான செயல்களில் ஈடுபட முடியவில்லை.
Explore sports injury care|விளையாட்டுக் காயங்களுக்கான சேவைகளை அறியுங்கள்
Changes during or after pregnancy|கர்ப்பகாலம் அல்லது பிரசவத்திற்குப் பிந்தைய மாற்றங்கள்
You want support with movement, strength or returning to exercise.|இயக்கம், வலிமை அல்லது மீண்டும் உடற்பயிற்சி செய்வதற்கு உதவி தேவை.
Explore women’s care|பெண்களுக்கான சேவைகளை அறியுங்கள்
Walking or balance feels harder|நடப்பது அல்லது சமநிலையைப் பேணுவது கடினமாக உள்ளது
You are finding everyday movement more difficult as you get older.|வயது அதிகரிக்கும்போது அன்றாட இயக்கம் சிரமமாக உள்ளது.
Explore care for older adults|முதியோருக்கான சேவைகளை அறியுங்கள்
Movement after a stroke|பக்கவாதத்திற்குப் பிந்தைய இயக்கம்
You need rehabilitation support with walking, coordination or daily activities.|நடை, ஒருங்கிணைப்பு அல்லது அன்றாடச் செயல்களுக்கு மறுவாழ்வு உதவி தேவை.
Explore neurological care|நரம்பியல் சேவைகளை அறியுங்கள்
CARE FOCUS|சேவையின் நோக்கம்
Ask us about this care|இந்தச் சேவை குறித்து எங்களிடம் கேளுங்கள்
Let’s find your next step.|உங்கள் அடுத்த படியைக் கண்டறிவோம்.
Try a different phrase or explore all care paths.|வேறு சொற்களைப் பயன்படுத்துங்கள் அல்லது அனைத்து வகைகளையும் பாருங்கள்.
Show all care paths|அனைத்து வகைகளையும் காட்டு
Start with a conversation|உரையாடலுடன் தொடங்குங்கள்
Tell us what feels difficult|உங்கள் சிரமங்களைத் தெரிவியுங்கள்
Focus on your movement|உங்கள் இயக்கத்தில் கவனம் செலுத்துங்கள்
Explore your needs and goals|உங்கள் தேவைகளையும் இலக்குகளையும் அறியுங்கள்
Find your next step|உங்கள் அடுத்த படியை அறியுங்கள்
Discuss care suited to you|உங்களுக்கேற்ற சிகிச்சை குறித்துப் பேசுங்கள்
LET’S TALK ABOUT YOUR NEEDS|உங்கள் தேவைகளைப் பற்றிப் பேசலாம்
Not sure which service you need?|எந்தச் சேவை தேவை என்று தெரியவில்லையா?
You don’t need to have it all figured out. Tell us what you are finding difficult, and we’ll help you explore the next step.|அனைத்தையும் முன்கூட்டியே தெரிந்திருக்க வேண்டியதில்லை. உங்கள் சிரமங்களைத் தெரிவியுங்கள்; அடுத்த படியை அறிய உதவுகிறோம்.
Start with an assessment|மதிப்பீட்டுடன் தொடங்குங்கள்
AGAI care guide|AGAI வழிகாட்டி
Automated clinic assistant|மையத்தின் தானியங்கி உதவியாளர்
Start a new chat|புதிய உரையாடலைத் தொடங்குங்கள்
Close chat|உரையாடலை மூடுங்கள்
A little help, right here|உங்களுக்கான உதவி இங்கே
Let’s find your|அறிந்துகொள்வோம்
next step.|உங்கள் அடுத்த படியை.
Questions about care or your first visit? Start here.|சிகிச்சை அல்லது முதல் வருகை குறித்துக் கேள்விகள் உள்ளனவா? இங்கே தொடங்குங்கள்.
Book a visit|முன்பதிவு செய்யுங்கள்
Explore care|சேவைகளை அறியுங்கள்
Care for your movement|உங்கள் இயக்கத்திற்கான சிகிச்சை
Find the clinic|மையத்தைக் கண்டறியுங்கள்
Directions & location|வழி மற்றும் இருப்பிடம்
Talk to the team|எங்கள் குழுவுடன் பேசுங்கள்
Continue on WhatsApp|WhatsApp-இல் தொடருங்கள்
Clinic information and booking guidance. For personal care advice, speak with our team.|மையத்தின் தகவல்கள் மற்றும் முன்பதிவுக்கான வழிகாட்டுதல். தனிப்பட்ட சிகிச்சை ஆலோசனைக்கு எங்கள் குழுவுடன் பேசுங்கள்.
Conversation|உரையாடல்
You|நீங்கள்
AGAI guide|AGAI வழிகாட்டி
Suggested questions|கேட்கக்கூடிய கேள்விகள்
Services|சேவைகள்
Your question|உங்கள் கேள்வி
Ask about AGAI…|AGAI குறித்து கேளுங்கள்…
Send message|செய்தியை அனுப்புங்கள்
Automated guidance · Chat stays in this tab|தானியங்கி வழிகாட்டுதல் · உரையாடல் இந்தத் தாவலில் மட்டுமே இருக்கும்
Close AGAI chat|AGAI உரையாடலை மூடுங்கள்
Open AGAI chat|AGAI உரையாடலைத் திறக்கவும்
Ask AGAI|AGAI-இடம் கேளுங்கள்
Here to guide you|உங்களுக்கு வழிகாட்டுகிறோம்
How do I book an appointment?|முன்பதிவு செய்வது எப்படி?
What services do you offer?|என்னென்ன சேவைகள் உள்ளன?
Where is the clinic?|மையம் எங்கே உள்ளது?
Contact the clinic team|மையக் குழுவைத் தொடர்புகொள்ளுங்கள்
Talk on WhatsApp|WhatsApp-இல் பேசுங்கள்
Contact details|தொடர்பு விவரங்கள்
Explore this service|இந்தச் சேவையை அறியுங்கள்
Call the clinic|மையத்தை அழையுங்கள்
About your first visit|உங்கள் முதல் வருகை பற்றி'''
for line in lines.splitlines():
 k,v=line.split('|',1);d[k]=v
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
