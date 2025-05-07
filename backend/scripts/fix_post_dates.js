import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Post from '../src/models/Post.js';

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { 
      // useNewUrlParser: true, useUnifiedTopology: true // não precisa nas versões novas
    });
    const posts = await Post.find({ created_at: { $exists: false }, createdAt: { $exists: true } });
    let count = 0;
    for (const post of posts) {
      post.created_at = post.createdAt;
      post.updated_at = post.updatedAt;
      await post.save();
      count++;
    }
    console.log(`Corrigidos ${count} posts!`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
