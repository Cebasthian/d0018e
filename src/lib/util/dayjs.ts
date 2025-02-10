
import { default as dayjs } from 'dayjs';

export function HasExpired(date: Date) {
    return dayjs().isBefore(date)
}

export function CreateExpirationDate(daysInFuture: number) {
    return dayjs().add(daysInFuture, "days").toDate()
}