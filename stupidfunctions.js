export async function getJSONFromURL(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Could not fetch or parse the JSON:", error);
    return null;
  }
}

export function times10(n){return n*10;}

// getJSONFromURL("")
//   .then(data => {
//     if (data) {
//       alert(data);
//     }
//   });

