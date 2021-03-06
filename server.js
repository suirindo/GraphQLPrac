const express = require('express');
const{ graphqlHTTP } = require('express-graphql');
const{ buildSchema} = require('graphql');

// GraphQLスキーマ言語を記述してスキーマを構築する
const schema = buildSchema(`
        input MessageInput{
            content: String
            author: String
        }
        type Message {
            id: ID!
            content: String
            author: String
        }
        type Query {
            getMessage(id: ID!): Message
        }
        type Mutation {
            createMessage(input: MessageInput): Message
            updateMessage(id: ID!, input: MessageInput):Message
        }
`);

class Message {
    constructor(id, {content, author}) {
        this.id = id;
        this.content = content;
        this.author = author;
    }
}

// データの入れ物
let fakeDatabase = {};

const root = {
    getMessage: ({id}) => {
        if(!fakeDatabase[id]){
            throw new Error('no message exists with id' + id);
        }
        return new Message(id, fakeDatabase[id]);
    },
    createMessage: ({input}) => {
        //ランダムなIDを生成
        var id = require('crypto').randomBytes(10).toString('hex');

        fakeDatabase[id] = input;
        return new Message(id, input);
    },
    updateMessage:({id, input}) => {
        if(!fakeDatabase[id]) {
            throw new Error('no message exists with id' + id);
        }
        //古いデータの書き換え
        fakeDatabase[id] = input;
        return new Message(id, input);
    },
};

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000, () => {
    console.log('Running a GraphQL API server at localhost:4000/graphql');
});







// // GraphQLスキーマ言語を記述してスキーマを構築する
// // スキーマはあくまで定義のみで実際のデータ操作は行わない
// // スキーマに引数を指定している

// const schema = buildSchema(`
//     type RandomDie {
//         numSides: Int!
//         rollOnce: Int!
//         roll(numRolls: Int!): [Int]
//     }

//     type Query {
//         getDie(numSides: Int): RandomDie
//     }
// `);

// // const schema = buildSchema(`
// //     type Query{
// //         rollDice(numDice: Int!, numSides: Int): [Int]
// //     }
// // `);

// // type Query {
// //     quoteOfTheDay: String
// //     random: Float
// //     rollThreeDice: [Int]
// // }


// // リゾルバ関数
// // リゾルバ関数とは特定のフィールドのデータを返す関数（メソッド）であり、実際のデータ操作を行う部分
// // スキーマで定義した「quoteOfTheDay: String]のデータ操作

// //リゾルバ関数内の処理をクラス化することも可能
// class RandomDie{
//     constructor(numSides) {
//         this.numSides = numSides;
//     }

//     rollOnce() {
//         return 1 + Math.floor(Math.random() * this.numSides);
//     }

//     roll({numRolls}) {
//         let output = [];
//         for (var i = 0; i<numRolls; i++) {
//             output.push(this.rollOnce());
//         }
//         return output;
//     }
// }


// // const root = {
// //     quoteOfTheDay: () => {
// //         return Math.random() < 0.5 ? "Take it easy" :
// //         'Salvation lies within';
// //     },
// // // スキーマで定義した「random:Float!」のデータ操作
// //     random: () => {
// //         return Math.random();
// //     },
// //     // スキーマで定義した「rollThreeDice:[Int]」のデータ操作
// //     rollThreeDice: () => {
// //         return[1,2,3].map((_) => 1 + Math.floor(Math.random()*6));
// //     },
// // };

// // リゾルバ関数
// // const root = {
// //     // クライアント側のクエリから引数の値を受け取る
// //     rollDice:({numDice, numSides}) => {
// //         let output = [];
// //         for (var i = 0; i<numDice; i++) {
// //             output.push(1 + Math.floor(Math.random() * (numSides || 6)));
// //         }
// //         return output;
// //     }
// // };

// const root = {
//     getDie: ({numSides}) => {
//         return new RandomDie(numSides || 6);
//     }
// }

// const app = express();
// app.use(
//     '/graphql',
//     graphqlHTTP({
//         schema: schema,
//         rootValue: root,
//         graphiql: true,
//     })
// );

// app.listen(4000);
// console.log('Running a GraphQL API server at http://localhost:4000/graphql');




// // Expressでサーバーを立てる
// // graphql:true としたので、GraphQLを利用できる
// // const app = express();
// // app.use(
// //     '/graphql',
// //     graphqlHTTP({
// //     schema: schema,
// //     rootValue: root,
// //     graphiql: true,
// // })
// // );

