export type DeepPartial<T> = T extends object ? {
    [P in keyof T]? : DeepPartial<T[P]> 
} : T;

export type HttpErrorMessage = {
    message: string,
    status: number,
    error: unknown,
    errorCode: string,
}