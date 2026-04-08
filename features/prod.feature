@prod
Feature: User Management API — Prod Environment

  Scenario: GET users returns 200 with array
    When I get all users in "prod"
    Then the response status should be 200
    And the response body should be an array

  Scenario: GET users includes previously created users
    Given I create a user in "prod" with name "User One" and age 25
    And I create a user in "prod" with name "User Two" and age 30
    When I get all users in "prod"
    Then the response status should be 200
    And the response body should contain the created emails

  Scenario: GET users returns correct schema fields
    Given I create a user in "prod" with name "Schema Check" and age 28
    When I get all users in "prod"
    Then the response status should be 200
    And each user should have "name" as a string
    And each user should have "email" as a string
    And each user should have "age" as a number

  Scenario: POST creates user with valid data
    When I create a user in "prod" with name "Jane Doe" and age 30
    Then the response status should be 201
    And the response body should have name "Jane Doe"
    And the response body should have age 30

  Scenario: POST with age at lower boundary
    When I create a user in "prod" with name "Young" and age 1
    Then the response status should be 201
    And the response body should have age 1

  Scenario: POST with age at upper boundary
    When I create a user in "prod" with name "Elder" and age 150
    Then the response status should be 201
    And the response body should have age 150

  Scenario: POST with age below minimum (0) returns 400
    When I create a user in "prod" with name "TooYoung" and age 0
    Then the response status should be 400

  Scenario: POST with age above maximum (151) returns 400
    When I create a user in "prod" with name "TooOld" and age 151
    Then the response status should be 400

  Scenario: POST without name returns 400
    When I create a user in "prod" without "name"
    Then the response status should be 400

  Scenario: POST without email returns 400
    When I create a user in "prod" without "email"
    Then the response status should be 400

  Scenario: POST without age returns 400
    When I create a user in "prod" without "age"
    Then the response status should be 400

  Scenario: POST with non-integer age returns 400
    When I create a user in "prod" with invalid age "abc"
    Then the response status should be 400

  Scenario: POST with duplicate email returns 409
    Given I create a user in "prod" with name "Original" and age 25
    When I create a duplicate user in "prod" with name "Duplicate" and age 30
    Then the response status should be 409

  Scenario: GET user by email returns 200 with correct data
    Given I create a user in "prod" with name "Fetch Me" and age 40
    When I get the created user in "prod"
    Then the response status should be 200
    And the response body should have name "Fetch Me"
    And the response body should have age 40

  Scenario: GET nonexistent user returns 404
    When I get a nonexistent user in "prod"
    Then the response status should be 404

  Scenario: PUT updates user and returns 200
    Given I create a user in "prod" with name "Before" and age 20
    When I update the user in "prod" with name "After" and age 25
    Then the response status should be 200
    And the response body should have name "After"
    And the response body should have age 25

  Scenario: PUT persists updated data on subsequent GET
    Given I create a user in "prod" with name "Initial" and age 20
    When I update the user in "prod" with name "Updated" and age 35
    And I get the created user in "prod"
    Then the response body should have name "Updated"
    And the response body should have age 35

  Scenario: PUT with age at lower boundary (1)
    Given I create a user in "prod" with name "BoundLow" and age 50
    When I update the user in "prod" with name "BoundLow" and age 1
    Then the response status should be 200
    And the response body should have age 1

  Scenario: PUT with age at upper boundary (150)
    Given I create a user in "prod" with name "BoundHigh" and age 50
    When I update the user in "prod" with name "BoundHigh" and age 150
    Then the response status should be 200
    And the response body should have age 150

  Scenario: PUT without required field returns 400
    Given I create a user in "prod" with name "MissingField" and age 25
    When I update the user in "prod" without "name"
    Then the response status should be 400

  Scenario: PUT nonexistent user returns 404
    When I update a nonexistent user in "prod" with name "Ghost" and age 25
    Then the response status should be 404

  Scenario: DELETE with valid auth returns 204
    Given I create a user in "prod" with name "Delete Me" and age 25
    When I delete the created user in "prod" with auth
    Then the response status should be 204

  Scenario: DELETE without auth returns 401
    Given I create a user in "prod" with name "No Auth" and age 30
    When I delete the created user in "prod" without auth
    Then the response status should be 401

  Scenario: DELETE with invalid token returns 401
    Given I create a user in "prod" with name "Bad Token" and age 30
    When I delete the created user in "prod" with invalid token
    Then the response status should be 401

  Scenario: DELETE nonexistent user returns 404
    When I delete a nonexistent user in "prod" with auth
    Then the response status should be 404

  Scenario: DELETE already deleted user returns 404
    Given I create a user in "prod" with name "Double Del" and age 25
    When I delete the created user in "prod" with auth
    Then the response status should be 204
    When I delete the created user again in "prod" with auth
    Then the response status should be 404

  Scenario: Deleted user no longer appears in GET list
    Given I create a user in "prod" with name "Del Verify" and age 25
    When I delete the created user in "prod" with auth
    And I get all users in "prod"
    Then the response body should not contain the created email
