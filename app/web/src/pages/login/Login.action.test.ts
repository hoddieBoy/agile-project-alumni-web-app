import {ActionFunctionArgs, json, redirect} from "react-router-dom";
import axiosConfig from "config/axiosConfig";
import AuthenticateResponse from "payload/response/AuthenticateResponse";
import {setCookie} from "utils/Cookie";
import action from "pages/login/Login.action"; // Adjust the import path as needed

jest.mock('config/axiosConfig');
jest.mock('utils/Cookie');

const axiosConfigMock = axiosConfig as jest.Mocked<typeof axiosConfig>;
const setCookieMock = setCookie as jest.MockedFunction<typeof setCookie>;

describe("Login Action", () => {
    const createFormData = (data: { [key: string]: string }) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        return formData;
    };

    const mockRequest = (formData: FormData): ActionFunctionArgs<'post'> => ({
        request: {
            formData: () => Promise.resolve(formData),
        } as Request,
        params: {}
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("should return error message if username or password is missing", async () => {
        const request = mockRequest(createFormData({ username: "", password: "" }));
        const result = await action(request)

        expect(result).toEqual({ message: 'Username and password are required.' });
    });

    test("should set cookies and redirect on successful authentication", async () => {
        const request = mockRequest(createFormData({ username: "testuser", password: "password" }));
        const response: AuthenticateResponse = {
            user_id: "123",
            username: "testuser",
            roles: ["user"],
            access_token: "access-token",
            refresh_token: "refresh-token",
            token_type: "Bearer"
        };

        axiosConfigMock.post.mockResolvedValueOnce({ data: response });

        const result = await action(request);

        expect(setCookieMock).toHaveBeenCalledWith('access_token', 'access-token', expect.any(Date));
        expect(setCookieMock).toHaveBeenCalledWith('refresh_token', 'refresh-token', expect.any(Date));
        expect(result).toEqual(redirect('/'));
    });

    test("should return error message for invalid username or password", async () => {
        const request = mockRequest(createFormData({ username: "testuser", password: "wrongpassword" }));

        axiosConfigMock.post.mockRejectedValueOnce({ response: { status: 401 } });

        const result = await action(request);

        expect(result).toEqual({ message: 'Invalid username or password.' });
    });

    test("should return generic error message for other errors", async () => {
        const request = mockRequest(createFormData({ username: "testuser", password: "password" }));

        axiosConfigMock.post.mockRejectedValueOnce(new Error("Network error"));

        const result = await action(request);

        expect(result).toEqual(json({ message: 'An error occurred. Please try again later.' }, { status: 500 }));
    });
});