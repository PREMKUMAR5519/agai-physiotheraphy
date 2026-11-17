const clinicDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
})

// A calendar-only Date, with the clinic's day regardless of the visitor's timezone.
export function clinicToday(now: Date) {
  const parts = clinicDate.formatToParts(now)
  const part = (type: string) => Number(parts.find(value => value.type === type)!.value)
  return new Date(part('year'), part('month') - 1, part('day'), 12)
}

export function isPastAppointmentTime(date: string, time: string, now: Date) {
  if (!date || time === 'Flexible') return false
  const match = /^(\d{2}):(\d{2}) (AM|PM)$/.exec(time)
  if (!match) return true
  const hours = Number(match[1]) % 12 + (match[3] === 'PM' ? 12 : 0)
  const timestamp = new Date(`${date}T${String(hours).padStart(2, '0')}:${match[2]}:00+05:30`).getTime()
  return !Number.isFinite(timestamp) || timestamp <= now.getTime()
}
