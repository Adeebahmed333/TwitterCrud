import { TweetRepository, HashtagRepository } from "../repository/index.js";
class TweetService {
  constructor() {
    this.tweetRepository = new TweetRepository();
    this.hashtagRepository = new HashtagRepository();
  }
  async create(data) {
    try {
      const content = data.content;
      const tags = content
        .match(/#[a-zA-Z0-9_]+/g)
        .map((tag) => tag.substring(1).toLowerCase()); //regex to extract hashtags
      // console.log(tags);
      const tweet = await this.tweetRepository.create(data);
      let alreadyPresentTags = await this.hashtagRepository.getByName(tags);
      let TitlealreadyPresentTags = alreadyPresentTags.map(
        (tags) => tags.title
      );
     // console.log(alreadyPresentTags);
      let newTags = tags.filter(
        (tag) => !TitlealreadyPresentTags.includes(tag)
      );
      newTags = newTags.map((tag) => {
        return { title: tag, tweets: [tweet.id] };
      });
      await this.hashtagRepository.bulkCreate(newTags);
      alreadyPresentTags.forEach((tag) => {
        tag.tweets.push(tweet.id);
        tag.save();
      });
      return tweet;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async get(id) {
    try {
      const tweet = await this.tweetRepository.getWithComments(id);
      return tweet;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
export default TweetService;
