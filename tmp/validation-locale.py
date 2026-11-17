from pathlib import Path
for f in ['src/components/AppointmentSection.tsx','src/pages/ContactPage.tsx']:
 p=Path(f);s=p.read_text(encoding='utf8').replace('<form onSubmit=', '<form onInvalidCapture={localizeValidation} onInputCapture={clearValidation} onSubmit=');p.write_text(s,encoding='utf8')
p=Path('src/components/AppointmentSection.tsx');s=p.read_text(encoding='utf8');s=s.replace("encodeURIComponent('Hello AGAI, I would like to book a physiotherapy appointment. Please help me with availability.')", "encodeURIComponent(isTamil ? 'வணக்கம் AGAI, இயன்முறை மருத்துவச் சந்திப்புக்கு முன்பதிவு செய்ய விரும்புகிறேன். கிடைக்கும் நேரத்தைத் தெரிவியுங்கள்.' : 'Hello AGAI, I would like to book a physiotherapy appointment. Please help me with availability.')");p.write_text(s,encoding='utf8')
