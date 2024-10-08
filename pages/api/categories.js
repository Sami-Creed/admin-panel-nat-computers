import { Category } from "@/models/categories";
import { mongooseConnect } from "@/lib/mongoose"; // Ensure you're connecting to the DB
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect(); // Ensure the database connection
  await isAdminRequest(req,res);

  if (method === 'GET') {
    res.json(await Category.find().populate('parent'));
  }

  if (method === 'POST') {
      const { name,parentCategory,properties } = req.body;
      const categoryDoc = await Category.create({name,parent:parentCategory || undefined,
      properties,
    }); // Correct field name
      res.json(categoryDoc);
  }

  if (method === 'PUT'){
    const { name,parentCategory,properties,_id } = req.body;
    const categoryDoc = await Category.updateOne({_id},
   {name,
    parent:parentCategory || undefined,
    properties,
       }); // Correct field name
    res.json(categoryDoc);
  }

  if (method === 'DELETE'){
    const {_id} = req.query;
    await Category.deleteOne({_id});
    res.json('Ok');
  }
}
