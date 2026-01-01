export class AxisService {
    constructor(private readonly baseApiUrl: string) {}

    private async apiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
        const response = await fetch(`${this.baseApiUrl}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API request failed: ${response.statusText}`);
        }

        return response;
    }

    async createSession(url: string) {
        const response = await this.apiRequest("/api/sessions", {
            method: "POST",
            body: JSON.stringify({ url }),
        });

        return await response.json();
    }

    async deleteSession(sessionId: string) {
        const response = await this.apiRequest(`/api/sessions/${sessionId}`, {
            method: "DELETE",
        });

        return await response.json();
    }

    async performAction(sessionId: string, action: any) {
        const response = await this.apiRequest(`/api/sessions/${sessionId}/actions`, {
            method: "POST",
            body: JSON.stringify(action),
        });

        return await response.json();
    }

    async captureScreenshot(sessionId: string): Promise<string | null> {
        try {
            const response = await this.apiRequest(`/api/sessions/${sessionId}/screenshots`, {
                method: "POST",
            });

            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer).toString('base64');
        } catch (error) {
            console.error('Failed to capture screenshot:', error);
            return null;
        }
    }
}
