# Reputation System

### Action Definitions

| ACTION                              | NAME     |
| ----------------------------------- | -------- |
| User creates question/answer        | post     |
| User upvotes a question/answer      | upvote   |
| User downvotes a question/answer    | downvote |
| User deletes a question/answer      | delete   |
| User saves a question to collection | bookmark |
| User searches something             | search   |

### Point System for Actions

| ACTION   | PERFORMER (USER WHO DOES THE ACTION) | TARGET (USER WHO OWNS THE QUESTION/ANSWER) |
| -------- | ------------------------------------ | ------------------------------------------ |
| post     | +5 (question), +10 (answer)          | +5 (question), +10 (answer)                |
| upvote   | +2                                   | +10                                        |
| downvote | -1                                   | -2                                         |
| delete   | -5 (question), -10 (answer)          | -5 (question), -10 (answer)                |
| bookmark | ???                                  | ???                                        |
