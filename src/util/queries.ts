export function getRecordsQuery(startDate: string, endDate: string, minCount: number, maxCount: number) {
    return [
        {
            "$match": {
                "$and": [
                    {
                        "createdAt": {
                            "$gte": new Date(startDate)
                        }
                    }, {
                        "createdAt": {
                            "$lte": new Date(endDate)
                        }
                    }
                ]
            }
        }, {
            "$project": {
                "key": "$key",
                "createdAt": "$createdAt",
                "totalCount": {
                    "$sum": "$counts"
                },
                "_id": 0
            }
        }, {
            "$match": {
                "$and": [
                    {
                        "totalCount": {
                            "$gte": minCount
                        }
                    }, {
                        "totalCount": {
                            "$lte": maxCount
                        }
                    }
                ]
            }
        }
    ];
}