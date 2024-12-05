export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (url, body) => {
  try {
    const res = await fetch(url, {
      method: "POST", // Corrected typo here
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const getRequest = async (url, authToken = null) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
  
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }
  
      const res = await fetch(url, {
        method: "GET",
        headers,
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
  
      return data;
    } catch (error) {
      return { error: true, message: error.message };
    }
  };
  
  export const postReq = async (url, body, authToken = null) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
  
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }
      console.log("Request Body:", body);
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
  
      return data;
    } catch (error) {
      return { error: true, message: error.message };
    }
  };

  export const getRequestById = async (url, id, authToken = null) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
  
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }
  
      const res = await fetch(`${url}/${id}`, {
        method: "GET",
        headers,
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
  
      return data;
    } catch (error) {
      return { error: true, message: error.message };
    }
  };
  