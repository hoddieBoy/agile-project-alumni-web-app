import {ActionFunctionArgs, json} from "react-router-dom";
import axiosConfig from "config/axiosConfig";
import AuthenticateResponse from "payload/response/AuthenticateResponse";
import action from "pages/login/Login.action"; // Adjust the import path as needed

jest.mock('config/axiosConfig');

const axiosConfigMock = axiosConfig as jest.Mocked<typeof axiosConfig>;

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
        } as unknown as Request,
        params: {}
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("should return error message if username or password is missing", async () => {
        const request = mockRequest(createFormData({username: "", password: ""}));
        const result = await action(request);

        expect(result).toEqual({message: 'Username and password are required.'});
    });

    test("should return success message for valid username and password", async () => {
        const request = mockRequest(createFormData({username: "testuser", password: "password"}));
        const response: AuthenticateResponse = {
            user_id: "123",
            username: "testuser",
            roles: ["user"],
            access_token: "access-token",
            refresh_token: "refresh-token",
            token_type: "Bearer"
        };

        axiosConfigMock.post.mockResolvedValueOnce({data: response});

        const result = await action(request);

        expect(result).toEqual({
            message: 'Successfully authenticated.',
            accessToken: 'access-token',
            refreshToken: 'refresh-token'
        });
    });

    test("should return error message for invalid username or password", async () => {
        const request = mockRequest(createFormData({username: "testuser", password: "wrongpassword"}));

        axiosConfigMock.post.mockRejectedValueOnce({response: {status: 401}});

        const result = await action(request);

        expect(result).toEqual({message: 'Invalid username or password.'});
    });

    test("should return generic error message for other errors", async () => {
        const request = mockRequest(createFormData({username: "testuser", password: "password"}));

        axiosConfigMock.post.mockRejectedValueOnce(new Error("Network error"));

        const result = await action(request);

        expect(result).toEqual(json({message: 'An error occurred. Please try again later.'}, {status: 500}));
    });
});
