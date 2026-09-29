import { TimeInterval, WeekDayTimeInterval } from "@/entities/time/model/time"

export function hasOverlappingTimeIntervals(
  intervals: TimeInterval[]
): boolean {
  const converted = intervals.map(({ startTime, endTime }) => ({
    start: startTime.hours * 60 + startTime.minutes,
    end: endTime.hours * 60 + endTime.minutes,
  }))

  converted.sort((a, b) => a.start - b.start)

  for (let i = 1; i < converted.length; i++) {
    if (converted[i].start < converted[i - 1].end) {
      return true
    }
  }

  return false
}

/**
 * Возвращает индексы интервалов, которые пересекаются хотя бы с одним другим интервалом.
 * Пересечение считается строгим (ненулевая длительность): интервалы [a,b] и [c,d]
 * пересекаются, если a < d и c < b.
 */
export function findOverlappingTimeIndices(
  intervals: TimeInterval[]
): number[] {
  const n = intervals.length
  if (n < 2) return []

  const startMinutes = intervals.map(
    (interval) => interval.startTime.hours * 60 + interval.startTime.minutes
  )
  const endMinutes = intervals.map(
    (interval) => interval.endTime.hours * 60 + interval.endTime.minutes
  )

  const overlapping = new Set<number>()

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const startI = startMinutes[i]
      const endI = endMinutes[i]
      const startJ = startMinutes[j]
      const endJ = endMinutes[j]

      if (startI < endJ && startJ < endI) {
        overlapping.add(i)
        overlapping.add(j)
      }
    }
  }

  return Array.from(overlapping).sort((a, b) => a - b)
}

/**
 * Возвращает индексы недельных интервалов, которые пересекаются хотя бы с одним другим
 * интервалом на том же дне недели. Пересечение считается строгим (ненулевая длительность):
 * интервалы [a,b] и [c,d] на одном дне недели пересекаются, если a < d и c < b.
 */
export function findOverlappingWeekDayTimeIndices(
  intervals: WeekDayTimeInterval[]
): number[] {
  const n = intervals.length
  if (n < 2) return []

  const overlapping = new Set<number>()

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (intervals[i].weekDay !== intervals[j].weekDay) continue

      const startI =
        intervals[i].time.startTime.hours * 60 +
        intervals[i].time.startTime.minutes
      const endI =
        intervals[i].time.endTime.hours * 60 + intervals[i].time.endTime.minutes
      const startJ =
        intervals[j].time.startTime.hours * 60 +
        intervals[j].time.startTime.minutes
      const endJ =
        intervals[j].time.endTime.hours * 60 + intervals[j].time.endTime.minutes

      if (startI < endJ && startJ < endI) {
        overlapping.add(i)
        overlapping.add(j)
      }
    }
  }

  return Array.from(overlapping).sort((a, b) => a - b)
}
