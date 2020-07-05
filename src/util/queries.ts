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
                "totalCount": {
                    "$sum": "$counts"
                },
                "key": "$key"
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