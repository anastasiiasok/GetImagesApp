const input = document.querySelector(".input");

const getImages = async () => {
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=cENQvJ74DRaUDEF1CjQtSA6fpsYFHG1l&q=${input.value}&limit=60`
  );

  const result = await response.json();
  const imagesArray = result.data;
  //console.log("imagesArray", imagesArray);
  for (image of imagesArray) {
    //console.log(image.images.downsized.url);
    const imgUrl = image.images.downsized.url;
    let img = document.createElement("img");
    img.src = imgUrl;

    document.body.append(img);
  }
};
