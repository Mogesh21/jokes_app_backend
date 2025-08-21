import { validationResult } from "express-validator";
import Joke from "../models/Joke.js";
import removeFile from "../utilities/removeFile.js";

export const getJokes = async (req, res) => {
  // #swagger.tags = ["Jokes"]
  try {
    const result = await Joke.getJokes();
    const formattedResult = result.map((joke) => {
      const baseUrl = `${process.env.SERVER}/public/jokes/`;
      const { speaker_image, joke_image, receiver_image, image_answer, ...restContent } =
        joke.content || {};

      const content = {
        ...restContent,
        ...(joke_image ? { joke_image: `${baseUrl}${joke_image}` } : {}),
        ...(speaker_image ? { speaker_image: `${baseUrl}${speaker_image}` } : {}),
        ...(receiver_image ? { receiver_image: `${baseUrl}${receiver_image}` } : {}),
        ...(image_answer ? { image_answer: `${baseUrl}${image_answer}` } : {}),
      };

      return {
        ...joke,
        content,
      };
    });

    res.status(200).json({
      data: formattedResult,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getJokeById = async (req, res) => {
  // #swagger.tags = ["Jokes"]
  try {
    const id = req.params.id;
    if (!id || !parseInt(id)) {
      return res.status(400).json({
        message: "id is required",
      });
    }

    const [result] = await Joke.getJokeById(id);
    if (result) {
      const baseUrl = `${process.env.SERVER}/public/jokes/`;
      const { joke_image, speaker_image, receiver_image, image_answer, ...restContent } =
        result.content || {};

      const content = {
        ...restContent,
        ...(joke_image ? { joke_image: `${baseUrl}${joke_image}` } : {}),
        ...(speaker_image ? { speaker_image: `${baseUrl}${speaker_image}` } : {}),
        ...(receiver_image ? { receiver_image: `${baseUrl}${receiver_image}` } : {}),
        ...(image_answer ? { image_answer: `${baseUrl}${image_answer}` } : {}),
      };

      const formattedResult = {
        ...result,
        content,
      };

      res.status(200).json({
        data: formattedResult || {},
        message: "Data fetched successfully",
      });
    } else {
      res.status(404).json({
        message: "Joke not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getJokesByCatId = async (req, res) => {
  // #swagger.tags = ["Jokes"]
  try {
    const id = req.params.id;
    if (!id || !parseInt(id)) {
      return res.status(400).json({
        message: "id is required",
      });
    }

    const result = await Joke.getJokeByCatId(id);
    const formattedResult = result.map((joke) => {
      const baseUrl = `${process.env.SERVER}/public/jokes/`;
      const { joke_image, speaker_image, receiver_image, image_answer, ...restContent } =
        joke.content || {};

      const content = {
        ...restContent,
        ...(joke_image ? { joke_image: `${baseUrl}${joke_image}` } : {}),
        ...(speaker_image ? { speaker_image: `${baseUrl}${speaker_image}` } : {}),
        ...(receiver_image ? { receiver_image: `${baseUrl}${receiver_image}` } : {}),
        ...(image_answer ? { image_answer: `${baseUrl}${image_answer}` } : {}),
      };

      return {
        ...joke,
        content,
      };
    });

    res.status(200).json({
      data: formattedResult,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getJokesBySubCatId = async (req, res) => {
  // #swagger.tags = ["Jokes"]
  try {
    const id = req.params.id;
    if (!id || !parseInt(id)) {
      return res.status(400).json({
        message: "id is required",
      });
    }

    const result = await Joke.getJokeBySubCatId(id);
    const formattedResult = result.map((joke) => {
      const baseUrl = `${process.env.SERVER}/public/jokes/`;
      const { joke_image, speaker_image, receiver_image, image_answer, ...restContent } =
        joke.content || {};

      const content = {
        ...restContent,
        ...(joke_image ? { joke_image: `${baseUrl}${joke_image}` } : {}),
        ...(speaker_image ? { speaker_image: `${baseUrl}${speaker_image}` } : {}),
        ...(receiver_image ? { receiver_image: `${baseUrl}${receiver_image}` } : {}),
        ...(image_answer ? { image_answer: `${baseUrl}${image_answer}` } : {}),
      };

      return {
        ...joke,
        content,
      };
    });

    res.status(200).json({
      data: formattedResult,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const addJoke = async (req, res) => {
  // #swagger.tags = ["Jokes"]
  //  #swagger.consumes = ['multipart/form-data']
  // #swagger.parameters['cat_id'] = {in: 'formData', required: true, type: 'number', description: 'Category Id' }
  // #swagger.parameters['subcat_id'] = {in: 'formData', type: 'number', description: 'Sub Category Id' }
  // #swagger.parameters['content'] = {in: 'formData', required: true, type: 'string', description: 'Joke Content' }
  // #swagger.parameters['joke_image'] = {in: 'formData', type: 'file', description: 'Joke Image' }
  // #swagger.parameters['speaker_image'] = {in: 'formData', type: 'file', description: 'Speaker Image' }
  // #swagger.parameters['receiver_image'] = {in: 'formData', type: 'file', description: 'Receiver Image' }
  // #swagger.parameters['image_answer'] = {in: 'formData', type: 'file', description: 'Answer Image' }
  const jokeImage =
    req.files && req.files["joke_image"] ? req.files["joke_image"][0]?.filename : "";
  const speakerImage =
    req.files && req.files["speaker_image"] ? req.files["speaker_image"][0]?.filename : "";
  const receiverImage =
    req.files && req.files["receiver_image"] ? req.files["receiver_image"][0]?.filename : "";
  const imageAnswer =
    req.files && req.files["image_answer"] ? req.files["image_answer"][0]?.filename : "";
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }
    const data = req.body;
    const content = JSON.parse(data.content);
    if (jokeImage) {
      content.joke_image = jokeImage;
    }
    if (speakerImage) {
      content.speaker_image = speakerImage;
    }
    if (receiverImage) {
      content.receiver_image = receiverImage;
    }
    if (imageAnswer) {
      content.image_answer = imageAnswer;
    }

    const insertId = await Joke.addJokes([{ ...data, content: content }]);
    res.status(200).json({
      data: {
        insertId,
      },
      message: "Joke added successfully",
    });
  } catch (err) {
    console.log(err);
    if (jokeImage) removeFile(jokeImage, "jokes");
    if (speakerImage) removeFile(speakerImage, "jokes");
    if (receiverImage) removeFile(receiverImage, "jokes");
    if (imageAnswer) removeFile(imageAnswer, "jokes");

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const addMultipleJoke = async (req, res) => {
  // #swagger.tags = ["Jokes"]
  // #swagger.parameters['cat_id'] = {in: 'formData', required: true, type: 'number', description: 'Category Id' }
  // #swagger.parameters['subcat_id'] = {in: 'formData', type: 'number', description: 'Sub Category Id' }
  // #swagger.parameters['content'] = {in: 'formData', required: true, type: 'string', description: 'Joke Content' }
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }
    const data = req.body;

    const insertId = await Joke.addJokes(data);
    res.status(200).json({
      data: {
        insertId,
      },
      message: "Jokes added successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateJoke = async (req, res) => {
  // #swagger.tags = ["Jokes"]
  //  #swagger.consumes = ['multipart/form-data']
  // #swagger.parameters['cat_id'] = {in: 'formData', required: true, type: 'number', description: 'Category Id' }
  // #swagger.parameters['subcat_id'] = {in: 'formData', type: 'number', description: 'Sub Category Id' }
  // #swagger.parameters['content'] = {in: 'formData', required: true, type: 'string', description: 'Joke Content' }
  // #swagger.parameters['joke_image'] = {in: 'formData', type: 'file', description: 'Joke Image' }
  // #swagger.parameters['speaker_image'] = {in: 'formData', type: 'file', description: 'Speaker Image' }
  // #swagger.parameters['receiver_image'] = {in: 'formData', type: 'file', description: 'Receiver Image' }
  // #swagger.parameters['image_answer'] = {in: 'formData', type: 'file', description: 'Answer Image' }
  const data = req.body;
  const content = JSON.parse(data.content);
  const joke_image = content.joke_image ? content.joke_image.split("/") : [];
  const speaker = content.speaker_image ? content.speaker_image.split("/") : [];
  const receiver = content.receiver_image ? content.receiver_image.split("/") : [];
  const answerImg = content.image_answer ? content.image_answer.split("/") : [];
  const jokeImageName = joke_image[joke_image.length - 1];
  const speakerImageName = speaker[speaker.length - 1];
  const receiverImageName = receiver[receiver.length - 1];
  const answerImageName = answerImg[answerImg.length - 1];

  const jokeImage =
    req.files && req.files["joke_image"] ? req.files["joke_image"][0]?.filename : jokeImageName;
  const speakerImage =
    req.files && req.files["speaker_image"]
      ? req.files["speaker_image"][0]?.filename
      : speakerImageName;
  const receiverImage =
    req.files && req.files["receiver_image"]
      ? req.files["receiver_image"][0]?.filename
      : receiverImageName;
  const imageAnswer =
    req.files && req.files["image_answer"]
      ? req.files["image_answer"][0]?.filename
      : answerImageName;
  try {
    const id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }
    const content = JSON.parse(data.content);
    const oldImage = {
      jokeImage: "",
      speakerImage: "",
      receiverImage: "",
      imageAnswer: "",
    };
    if (req.files && req.files["joke_image"]) {
      oldImage.jokeImage = jokeImageName;
      content.joke_image = jokeImage;
    } else {
      content.joke_image = jokeImageName;
    }
    if (req.files && req.files["speaker_image"]) {
      oldImage.speakerImage = speakerImageName;
      content.speaker_image = speakerImage;
    } else {
      content.speaker_image = speakerImageName;
    }
    if (req.files && req.files["receiver_image"]) {
      oldImage.receiverImage = receiverImageName;
      content.receiver_image = receiverImage;
    } else {
      content.receiver_image = receiverImageName;
    }
    if (req.files && req.files["image_answer"]) {
      oldImage.imageAnswer = answerImageName;
      content.image_answer = imageAnswer;
    } else {
      content.image_answer = answerImageName;
    }

    const result = await Joke.updateJoke({ ...data, content: content, id });
    if (result === 0) {
      res.status(404).json({
        message: "Joke not found",
      });
    } else {
      // if (oldImage.jokeImage) removeFile(oldImage.jokeImage, "jokes");
      // if (oldImage.speakerImage) removeFile(oldImage.speakerImage, "jokes");
      // if (oldImage.receiverImage) removeFile(oldImage.receiverImage, "jokes");
      // if (oldImage.imageAnswer) removeFile(oldImage.imageAnswer, "jokes");
      res.status(200).json({
        message: "Joke updated successfully",
      });
    }
  } catch (err) {
    console.log(err);
    // if (req.files && req.files["joke_image"]) removeFile(jokeImage, "jokes");
    // if (req.files && req.files["speaker_image"]) removeFile(speakerImage, "jokes");
    // if (req.files && req.files["receiver_image"]) removeFile(receiverImage, "jokes");
    // if (req.files && req.files["image_answer"]) removeFile(imageAnswer, "jokes");

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteJoke = async (req, res) => {
  // #swagger.tags = ["Jokes"]
  try {
    const id = req.params.id;
    if (!id && !parseInt(id)) {
      return res.status(400).json({
        message: "id is required",
      });
    }
    const [result, data] = await Joke.deleteJoke(id);
    if (result === 0) {
      res.status(404).json({
        message: "Joke not found",
      });
    } else {
      const content = data.content;
      if (content.joke_image) {
        removeFile(content.joke_image, "jokes");
      }
      if (content.speaker_image) {
        removeFile(content.speaker_image, "jokes");
      }
      if (content.receiver_image) {
        removeFile(content.receiver_image, "jokes");
      }
      if (content.image_answer) {
        removeFile(content.image_answer, "jokes");
      }
      res.status(200).json({
        message: "Joke deleted successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
