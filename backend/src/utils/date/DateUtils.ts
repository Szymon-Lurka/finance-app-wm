import dayjs from "dayjs";

const getNow = () => {
    return dayjs().locale('pl').toISOString()
}

export {
    getNow
}