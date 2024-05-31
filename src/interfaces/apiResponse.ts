export default interface IAPIResponse<T> {
    data: T | null;
    error: null | string;
    status: number;
}
