// SearchAction.test.ts
import {ActionFunctionArgs} from "react-router-dom";
import axiosConfig from "config/axiosConfig";
import {getAccessToken} from "utils/Token";
import action from "pages/search/Search.action"; // Adjust the import path as needed
import {SearchResponse} from "payload/response/SearchResponse";

jest.mock('config/axiosConfig');
jest.mock('utils/Token');

const axiosConfigMock = axiosConfig as jest.Mocked<typeof axiosConfig>;
const getAccessTokenMock = getAccessToken as jest.MockedFunction<typeof getAccessToken>;

describe("Search Action", () => {
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

    test("should return error message if no search criteria are provided", async () => {
        const request = mockRequest(createFormData({}));
        const result = await action(request);

        expect(result).toEqual({message: 'At least one search criteria is required.'});
    });

    test("should return search results on successful search", async () => {
        const request = mockRequest(createFormData({name: "John", city: "Paris"}));
        const response: SearchResponse = {
            results: [
                {
                    id: "1",
                    fullName: "John Doe",
                    currentCompany: "Company A",
                    city: "Paris",
                    country: "France",
                    graduationYear: "2020"
                },
                {
                    id: "2",
                    fullName: "John Smith",
                    currentCompany: "Company B",
                    city: "Paris",
                    country: "France",
                    graduationYear: "2021"
                }
            ]
        };

        getAccessTokenMock.mockReturnValue('mock-access-token');
        axiosConfigMock.get.mockResolvedValueOnce({data: response});

        const result = await action(request);

        expect(result).toEqual(response.results);
    });

    test("should return error message for failed search due to network or server error", async () => {
        const request = mockRequest(createFormData({name: "John", city: "Paris"}));

        getAccessTokenMock.mockReturnValue('mock-access-token');
        axiosConfigMock.get.mockRejectedValueOnce(new Error("Network error"));

        const result = await action(request);

        expect(result).toEqual({message: 'Failed to fetch data.'});
    });
});