import { isSameMonth } from '../../../utils/isSameMonth'

export default function isOutside(date, month) {
    return !isSameMonth(date, month)
}
