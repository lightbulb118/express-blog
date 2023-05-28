import { db } from "../firebase";
import { Comment } from "../types";

export default class Post {
  private static path = "posts";

  public id?: string;
  public title: string;
  public content: string;
  public author: string;
  public coAuthors?: string[];
  public comments?: Comment[];

  constructor(post: Post) {
    this.title = post.title;
    this.content = post.content;
    this.author = post.author;
  }

  public static async create(post: Post) {
    try {
      const ref = await db.collection(this.path).add(post);

      return ref;
    } catch (e) {
      console.log(e);
    }
  }

  public static async find() {
    try {
      const result: Post[] = [];
      const snapShot = await db.collection(this.path).get();

      snapShot.forEach((doc) => {
        result.push({ id: doc.id, ...(doc.data() as any) });
      });

      return result;
    } catch (e) {
      console.log(e);
    }
  }

  public static async findById(id: string) {
    try {
      const result = await db.collection(this.path).doc(id).get();

      return result.data() as Post;
    } catch (e) {
      console.log(e);
    }
  }

  public static async update(id: string, updates: Partial<Post>) {
    try {
      const res = await db.collection("cities").doc(id).update(updates);

      return res;
    } catch (e) {
      console.log(e);
    }
  }

  public static async addComment(id: string, comment: Comment) {
    try {
      const post = await Post.findById(id);

      const res = await db
        .collection("posts")
        .doc(id)
        .update({ comments: [...(post?.comments || []), comment] });
    } catch (e) {
      console.log(e);
    }
  }
}
