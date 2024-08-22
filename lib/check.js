function CheckPropertyLink(propertyLink) {
    fetch(propertyLink)
    .then((response) => {
      if (response.status >= 400) {
        throw new Error(`${response.status} Property does not exist :( \n`);
      } else {
        return true
      }
    })
    .catch((error) => {
      console.error(error);
      process.exit(1); // Terminate the program with an error code as the page is not found
    });
}

module.exports = { CheckPropertyLink };
