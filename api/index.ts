type ApiPayload = Record<string, unknown>;
export type ApiResponse<T = any> = Promise<T | null>;

const fetchData = async (herokuEndpoint = '', method: 'GET' | 'PUT' | 'POST', obj?: ApiPayload): ApiResponse => {
    try {
        console.log(` ::: API Request for ${herokuEndpoint} :::`, method !== 'GET' ? obj : '');
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;

        const endpoint = `${apiUrl}/api/${herokuEndpoint}`;

        let response;

        response = await fetch(endpoint, {
            method,
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(obj),
        });


        if (response.status === 200) {
            const responseJson = await response.json();
            return responseJson;
        }
        console.log(` ::: DATA Failed for ${herokuEndpoint} :::`);
        return null;
    } catch (e) {
        console.log('Catch Error: ', e);
    }
    return null;
};

export const getAllScores = async () =>
    fetchData(
        'scoreboard/all',
        'GET'
    );