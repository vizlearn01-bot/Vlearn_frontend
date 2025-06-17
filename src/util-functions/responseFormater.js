export const responseFormater = async (response) => {
	let responseData;
	try {
		responseData = await response.json();
	} catch (error) {
		responseData = null;
	}
	if (response.status === 204) {
		return {
			responseCode: response.status,
			responseData: null,
		};
	}

	if (responseData) {
		if (response.status === 200 || response.status === 201) {
			if (responseData.data || responseData.messages) {
				return {
					responseCode: response.status,
					responseData: responseData,
				};
			} else {
				return {
					responseCode: response.status,
					responseData: {
						data: responseData,
					},
				};
			}
		} else {
			if (responseData.errors) {
				return {
					responseCode: response.status,
					responseData: responseData,
				};
			} else {
				return {
					responseCode: response.status,
					responseData: {
						errors: responseData,
					},
				};
			}
		}
	} else {
		if (response.status === 404) {
			return {
				responseCode: response.status,
				responseData: {
					errors: { detail: "Error 404: Resourse not found" },
				},
			};
		} else {
			return {
				responseCode: response.status,
				responseData: {
					errors: { detail: "Unknown server error" },
				},
			};
		}
	}
};
