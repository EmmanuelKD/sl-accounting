export function fromPascalToReadable(data:string):string {
    return data
      .toLowerCase() // Convert the entire string to lowercase
      .split('_')    // Split the string into an array using underscore as the delimiter
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' ');    // Join the array back into a string with spaces
  }
  