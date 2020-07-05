import request from "supertest";
import app from "../src/app";
import { ErrorMessages } from "../src/util/errorMessages";
import mongoose from "mongoose";
import { Record, RecordJSON } from "../src/models/record";

describe("test response body validations", () => {

    it("start date not provided", (done) => {
        return request(app).post("/records")
            .send({
                "endDate": "2017-02-02", 
                "minCount": 10, 
                "maxCount": 13
            })
            .expect(200)
            .end(function(err, res) {
                expect(res.body.msg).toBe(ErrorMessages.STARTDATE_NOT_GIVEN);
                done();
            });

    });

    it("end date not provided", (done) => {
        return request(app).post("/records")
            .send({
                "startDate": "2016-01-26",
                "minCount": 10, 
                "maxCount": 13
            })
            .expect(200)
            .end(function(err, res) {
                expect(res.body.msg).toBe(ErrorMessages.ENDDATE_NOT_GIVEN);
                done();
            });

    });

    it("min count not provided", (done) => {
        return request(app).post("/records")
            .send({
                "startDate": "2016-01-26",
                "endDate": "2017-02-02", 
                "maxCount": 13
            })
            .expect(200)
            .end(function(err, res) {
                expect(res.body.msg).toBe(ErrorMessages.MIN_NOT_GIVEN);
                done();
            });

    });

    it("max count not provided", (done) => {
        return request(app).post("/records")
            .send({
                "startDate": "2016-01-26",
                "endDate": "2017-02-02", 
                "minCount": 13
            })
            .expect(200)
            .end(function(err, res) {
                expect(res.body.msg).toBe(ErrorMessages.MAX_NOT_GIVEN);
                done();
            });

    });

    it("start date format wrong", (done) => {
        return request(app).post("/records")
            .send({
                "startDate": "asd",
                "endDate": "2017-02-02", 
                "minCount": 13,
                "maxCount": 20
            })
            .expect(200)
            .end(function(err, res) {
                expect(res.body.msg).toBe(ErrorMessages.STARTDATE_NOT_VALID);
                done();
            });

    });

    it("end date format wrong", (done) => {
        return request(app).post("/records")
            .send({
                "startDate": "2017-02-02",
                "endDate": "asdasd", 
                "minCount": 13,
                "maxCount": 20
            })
            .expect(200)
            .end(function(err, res) {
                expect(res.body.msg).toBe(ErrorMessages.ENDDATE_NOT_VALID);
                done();
            });

    });

    it("min count not numeric", (done) => {
        return request(app).post("/records")
            .send({
                "startDate": "2017-02-02",
                "endDate": "2017-02-02", 
                "minCount": "asd",
                "maxCount": 20
            })
            .expect(200)
            .end(function(err, res) {
                expect(res.body.msg).toBe(ErrorMessages.MIN_NOT_NUMERIC);
                done();
            });

    });

    it("max count not numeric", (done) => {
        return request(app).post("/records")
            .send({
                "startDate": "2017-02-02",
                "endDate": "2017-02-02", 
                "minCount": 13,
                "maxCount": "asd"
            })
            .expect(200)
            .end(function(err, res) {
                expect(res.body.msg).toBe(ErrorMessages.MAX_NOT_NUMERIC);
                done();
            });

    });

    it("start date after end date", (done) => {
        return request(app).post("/records")
            .send({
                "startDate": "2017-02-02",
                "endDate": "2017-01-02", 
                "minCount": 13,
                "maxCount": 20
            })
            .expect(200)
            .end(function(err, res) {
                expect(res.body.msg).toBe(ErrorMessages.STARTDATE_NOT_BEFORE_ENDDATE);
                done();
            });

    });

    it("min is bigger than max", (done) => {
        return request(app).post("/records")
            .send({
                "startDate": "2017-01-02",
                "endDate": "2017-03-02", 
                "minCount": 22,
                "maxCount": 20
            })
            .expect(200)
            .end(function(err, res) {
                expect(res.body.msg).toBe(ErrorMessages.MAX_NOT_GTE_MIN);
                done();
            });

    });

});

describe("test queries", () => {

    function clearDB() {
        for (const i in mongoose.connection.collections) {
          mongoose.connection.collections[i].remove(function() {
              console.log("removed");
          });
        }
    }

    function insertTestDocuments() {
        const records = [
            {
                key: "doc1",
                createdAt: new Date("2017-01-28"),
                counts: [1,2,3]
            },
            {
                key: "doc2",
                createdAt: new Date("2017-02-10"),
                counts: [10, 20]
            },
            {
                key: "doc3",
                createdAt: new Date("2017-03-02"),
                counts: [33]
            },
            {
                key: "doc4",
                createdAt: new Date("2017-04-17"),
                counts: [5,6]
            },
        ];
        Record.insertMany(records);
    }

    beforeAll((done) => {

          /*
            If the mongoose connection is closed, 
            start it up using the test url and database name
            provided by the node runtime ENV
          */
          if (mongoose.connection.readyState === 0) {
            mongoose.connect(
              process.env.MONGODB_URI, // <------- IMPORTANT
              function(err) {
                if (err) {
                  throw err;
                }
                insertTestDocuments();  
                return done();
              }
            );
          } else {
            insertTestDocuments();
            return done();
          }
    });


    afterAll(() => {
        clearDB();
    });

    it("check date working", (done) => {
        return request(app).post("/records")
            .send({
                "startDate": "2017-03-01",
                "endDate": "2017-05-01", 
                "minCount": 0,
                "maxCount": 100
            })
            .expect(200)
            .end(function(err, res) {
                expect(["doc3", "doc4"]).toEqual(expect.arrayContaining(res.body.records.map((record: RecordJSON)=> record.key)));
                done();
            });

    });

    it("check count working", (done) => {
        return request(app).post("/records")
            .send({
                "startDate": "2017-01-01",
                "endDate": "2017-05-01", 
                "minCount": 20,
                "maxCount": 40
            })
            .expect(200)
            .end(function(err, res) {
                expect(["doc2", "doc3"]).toEqual(expect.arrayContaining(res.body.records.map((record: RecordJSON)=> record.key)));
                done();
            });

    });

});