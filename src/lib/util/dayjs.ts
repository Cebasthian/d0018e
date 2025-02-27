
import { default as dayjs } from 'dayjs';
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("Europe/Stockholm")

export function HasExpired(date: Date) {
    return dayjs().isAfter(date)
}

export function CreateExpirationDate(daysInFuture: number) {
    return dayjs().add(daysInFuture, "days").toDate()
}

export function Today() {
    return dayjs().toDate()
}

export function DateString(date: Date) {
    return dayjs(date).format("YYYY-MM-DD HH:mm")
}