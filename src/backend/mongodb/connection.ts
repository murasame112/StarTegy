import { ObjectId } from 'bson';
import { MongoClient, ServerApiVersion, Collection } from 'mongodb';
import { connectionString } from '../config';
const uri = connectionString;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

const db_name = 'StarTegy';

export async function run() {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log(
        'Pinged your deployment. You successfully connected to MongoDB!'
    );
}

export async function stop() {
    await client.close();
}

// ========= database functions =========

export async function getItemById(id: string, collection_name: string) {
    const database = client.db(db_name);
    try {
        const collection: Collection = database.collection(collection_name);

        const item = await collection.findOne({ _id: new ObjectId(id) });
        return item;
    } catch {
        console.log('getItemById fail');
    }
}

export async function getAllItems(collection_name: string) {
    const database = client.db(db_name);
    try {
        const collection: Collection = database.collection(collection_name);
        const cursor = await collection.find();
        const items: any[] = [];
        for await (const doc of cursor) {
            items.push(doc);
        }
        return items;
    } catch {
        console.log('getAllItems failed');
    }
}

export async function insertItem(item: Object, collection_name: string) {
    const database = client.db(db_name);
    try {
        const collection: Collection = database.collection(collection_name);

        const res = await collection.insertOne(item);
        return res;
    } catch {
        console.log('insertItem failed');
    }
}

export async function deleteItemById(id: ObjectId, collection_name: string) {
    const database = client.db(db_name);
    try {
        const collection: Collection = database.collection(collection_name);

        const res = await collection.deleteOne({ _id: id });
        return res;
    } catch {
        console.log('deletItem failed');
    }
}

export async function getItemsByField(query: Object, table_name: string) {
  const database = client.db(db_name);
  try {
    const table: any = database.collection(table_name);

    const cursor = table.find(query, {
      sort: { _id: 1 },
    });

    const res = await cursor.toArray();
    return res;
  } catch {
  	console.log('getItemsByField failed');
  }
}

export async function updateItemById(
  id: string,
  table_name: string,
  updateQuery: Object
) {
  const database = client.db(db_name);
  try {
    const table: any = database.collection(table_name);

    const res = await table.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateQuery }
    );

    return res;
  } catch {
  	console.log('updateItemById failed');
  }
}