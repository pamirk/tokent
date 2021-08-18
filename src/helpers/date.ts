const isPlural = (value: number) => (Math.floor(value) === 1 ? false : true)

export const timeSince = (date: Date, short?: boolean) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  let interval = seconds / 31536000

  if (interval > 1) {
    const str = isPlural(interval) ? (short ? "y" : " years") : " year"
    return Math.floor(interval) + str
  }
  interval = seconds / 2592000
  if (interval > 1) {
    const str = short ? "mo" : isPlural(interval) ? " months" : " month"
    return Math.floor(interval) + str
  }
  interval = seconds / 86400
  if (interval > 1) {
    const str = short ? "d" : isPlural(interval) ? " days" : " day"
    return Math.floor(interval) + str
  }
  interval = seconds / 3600
  if (interval > 1) {
    const str = short ? "h" : isPlural(interval) ? " hours" : " hour"
    return Math.floor(interval) + str
  }
  interval = seconds / 60
  if (interval > 1) {
    const str = short ? "m" : isPlural(interval) ? " minutes" : " minute"
    return Math.floor(interval) + str
  }

  const str = short ? "s" : isPlural(interval) ? " seconds" : " second"
  return Math.floor(seconds) + str
}
