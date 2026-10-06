const USER_DATA_EXPIRATION_TIME_IN_DAYS = 10

type timeMeasurement = "ms" | "s"

export const userDataExpirationTime = (msr: timeMeasurement) => {
    const durationInSeconds = USER_DATA_EXPIRATION_TIME_IN_DAYS * 24 * 60 * 60

    switch (msr) {
        case "ms":
            return durationInSeconds * 1000
        case "s":
            return durationInSeconds
        default:
            return USER_DATA_EXPIRATION_TIME_IN_DAYS
    }
}
