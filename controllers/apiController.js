import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";
import Joke from "../models/Joke.js";
import filterCategoriesByVersion from "../utilities/filterCategoryByVersion.js";

export const getCategories = async (req, res) => {
  // #swagger.tags = ['API']
  // #swagger.parameters['body'] = { in: 'body', schema: { app_id: 1, version: '1.0.0', last_cat_id: null }}
  try {
    const { app_id, version, last_cat_id } = req.body;
    if (!app_id) {
      return res.status(200).json({
        result: 0,
        resultData: null,
        message: "app_id is required",
      });
    } else if (!version) {
      return res.status(200).json({
        result: 0,
        resultData: null,
        message: "version is required",
      });
    } else if (last_cat_id === undefined) {
      return res.status(200).json({
        result: 0,
        resultData: null,
        message: "last_cat_id is required",
      });
    }

    const last_id = isNaN(parseInt(last_cat_id)) ? 0 : last_cat_id;
    const result = await Category.getCategoryByAppId(app_id, last_id);

    const filteredResult = filterCategoriesByVersion(result, version);

    const formattedResult = filteredResult.map((data) => ({
      id: data.id,
      type_id: data.type_id,
      name: data.name,
      color: data.color,
      border_color: data.border_color,
      image_url: `${process.env.SERVER}/public/categories/${data.cover_image}`,
      has_subcategory: data.has_subcategory,
    }));

    res.status(200).json({
      result: 1,
      resultData: {
        data: formattedResult,
      },
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      result: 0,
      resultData: null,
      message: "Internal Server Error",
    });
  }
};

export const getSubcategories = async (req, res) => {
  // #swagger.tags = ['API']
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { cat_id: 1, last_subcat_id: null }}
  try {
    const { cat_id, last_subcat_id } = req.body;
    if (!cat_id) {
      return res.status(200).json({
        result: 0,
        resultData: null,
        message: "cat_id is required",
      });
    }
    const last_id = isNaN(parseInt(last_subcat_id)) ? 0 : last_subcat_id;
    const result = await Subcategory.getSubCategoriesByCatId(cat_id, last_id);

    const formattedResult = result.map((data) => ({
      id: data.id,
      cat_id: data.cat_id,
      name: data.name,
      color: data.color,
      border_color: data.border_color,
      image_url: `${process.env.SERVER}/public/subcategories/${data.cover_image}`,
    }));

    res.status(200).json({
      result: 1,
      resultData: {
        data: formattedResult,
      },
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      result: 0,
      resultData: null,
      message: "Internal Server Error",
    });
  }
};

export const getJokes = async (req, res) => {
  // #swagger.tags = ['API']
  // #swagger.parameters['body'] = { in: 'body', schema: { cat_id: null, subcat_id: null, joke_id: null }}
  try {
    const { cat_id, subcat_id, joke_id } = req.body;

    // if (cat_id === undefined && subcat_id === undefined) {
    //   return res.status(200).json({
    //     result: 0,
    //     resultData: null,
    //     message: "Either cat_id or subcat_id is required",
    //   });
    // }

    let result = [];
    if (!isNaN(parseInt(subcat_id))) {
      result = await Joke.getJokeBySubCatId(subcat_id, joke_id);
    } else if (!isNaN(parseInt(cat_id))) {
      result = await Joke.getJokeByCatId(cat_id, joke_id);
    } else {
      result = await Joke.getJokes(500, joke_id);
    }
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

      if (joke.content) delete joke.content;
      return {
        ...joke,
        ...content,
      };
    });
    res.status(200).json({
      result: 1,
      resultData: { data: formattedResult },
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      result: 0,
      resultData: null,
      message: "Internal Server Error",
    });
  }
};
