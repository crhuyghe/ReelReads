def run_quiz(questions):
    score = 0
    for question, options, answer in questions:
        print(question)
        for i, option in enumerate(options):
            print(f"{i + 1}. {option}")
        while True:
            try:
                user_answer = int(input("Enter your answer (1-{}): ".format(len(options))))
                if 1 <= user_answer <= len(options):
                    break
                else:
                    print("Invalid input. Please enter a number within the range.")
            except ValueError:
                print("Invalid input. Please enter a number.")
        if options[user_answer - 1] == answer:
            print("Correct!")
            score += 1
        else:
            print(f"Incorrect. The correct answer was {answer}.")
        print("-" * 20)
    print(f"You scored {score} out of {len(questions)} questions.")

movie_questions = [
    ("What is the name of the snowman in 'Frozen'?", ["1", "2", "Olaf", "4"], "Olaf"),
    ("Which 1995 film is considered the first full-length computer-animated feature?", ["1", "2", "3", "Toy Story"], "Toy Story"),
    ("What type of fish is Nemo in 'Finding Nemo'?", ["1", "2", "Clownfish", "4"], "Clownfish"),
    ("Who is the fashion designer in 'The Incredibles'?", ["Edna Mode", "2", "3", "4"], "Edna Mode"),
    ("What animated movie features a character named Hiccup?", ["1", "How to Train Your Dragon", "3", "4"], "How to Train Your Dragon"),
    ("What is the main character’s name in 'Ratatouille'?", ["Remy", "2", "3", "4"], "Remy"),
    ("Which animated film features a superhero family?", ["1", "2", "The Incredibles", "4"], "The Incredibles"),
    ("What is the name of the princess in 'The Princess and the Frog'?", ["1", "2", "Tiana", "4"], "Tiana"),
    ("In 'Zootopia', what animal is Judy Hopps?", ["1", "2", "3", "Rabbit"], "Rabbit"),
    ("Who provided the voice for Genie in the 1992 'Aladdin'?", ["1", "2", "3", "Robin Williams"], "Robin Williams"),
    ("Which movie features a villain named Lord Farquaad?", ["1", "Shrek", "3", "4"], "Shrek"),
    ("In 'Fight Club,' what rule is most associated with Fight Club?", ["You do not talk about Fight Club", "2", "3", "4"], "You do not talk about Fight Club"),
    ("In 'Office Space', what is the name of the main character?", ["1", "Peter Gibbons", "3", "4"], "Peter Gibbons"),
    ("In 'Harry Potter', what is the name of Harry's pet owl?", ["1", "2", "Hedwig", "4"], "Hedwig"),
    ("In 'The Chronicles of Narnia', what is the name of the lion?", ["Aslan", "2", "3", "4"], "Aslan"),
    ("What fantasy series involves a dark lord known as Sauron?", ["1", "2", "3", "The Lord of the Rings"], "The Lord of the Rings"),
    ("What is the fictional sport played in 'Harry Potter'?", ["1", "2", "Quidditch", "4"], "Quidditch"),
    ("Which person has not held the title of Captain America in the MCU?", ["Steve Rogers", "John Walker", "Tony Stark", "Sam Wilson"], "Tony Stark"),
    ("Who cut Thanos' head off in 'Avengers: Endgame'?", ["1", "Thor", "3", "4"], "Thor"),
    ("In 'Avengers: Endgame', which infinity stone does Natasha sacrifice herself for?", ["Soul Stone", "2", "3", "4"], "Soul Stone"),
    ("In Thor: Ragnarok. who does Thor fight in the arena while stuck on Sakaar?", ["1", "The Hulk", "3", "4"], "The Hulk"),
    ("In 'Star Wars', what is the name of Han Solo's ship?", ["1", "2", "Millennium Falcon", "4"], "Millennium Falcon"),
    ("What was the first feature-length animated movie ever released?", ["Snow White and the Seven Dwarfs", "2", "3", "4"], "Snow White and the Seven Dwarfs"),
    ("What Star Wars movie was released in 1977?", ["1", "2", "3", "Star Wars: A New Hope"], "Star Wars: A New Hope"),
    ("In 'The Matrix', what color pill does Neo take?", ["1", "Red", "3", "4"], "Red"),
]
book_questions = [
    ("A young boy takes a train to the North Pole on Christmas Eve in what classic 1985 children's book by Chris Van Allsburg?", ["1", "2", "The Polar Express", "4"], "The Polar Express"),
    ("In the classic 1957 children's book, 'How the Grinch Stole Christmas,' what is the name of the town the Grinch steals holiday presents and decorations from?", ["1", "2", "3", "Whoville"], "Whoville"),
    ("What is the name of the third book in the Twilight series by Stephenie Meyer?", ["1", "2", "Eclipse", "4"], "Eclipse"),
    ("In 'The Lion, the Witch, and the Wardrobe,' what magical country does the White Witch put a spell on so that it is always winter but never Christmas?", ["Narnia", "2", "3", "4"], "Narnia"),
    ("'Draco Dormiens Nunquam Titillandus,' translated as 'Never Tickle A Sleeping Dragon,' is the official motto for what fictional place of learning?", ["1", "Hogwarts", "3", "4"], "Hogwarts"),
    ("Thestrals and Floo Powder are both forms of transportation invented by what internationally-renowned author?", ["JK Rowling", "2", "3", "4"], "JK Rowling"),
    ("What 1847 Emily Bronte classic deals with two West Yorkshire families, the Earnshaws and the Lintons, and in particular the adopted Earnshaw, Heathcliff?", ["1", "2", "Wuthering Heights", "4"], "Wuthering Heights"),
    ("A large portion of what 2001 Yann Martel novel features the title character stranded on a lifeboat after a shipwreck with a Bengal tiger named Richard Parker?", ["1", "2", "Life of Pi", "4"], "Life of Pi"),
    ("Named after a London railway station, what fictional literary bear was originally a stowaway from 'Darkest Peru?'", ["1", "2", "3", "Paddington Bear"], "Paddington Bear"),
    ("The Berenstain Bears live in what interesting type of home?", ["1", "2", "3", "Treehouse"], "Treehouse"),
    ("What is the name of the dancing clown in Stephen King's famed horror novel 'It?'", ["1", "It", "3", "4"], "It"),
    ("What British Author wrote 'The Cricket on the Hearth' and 'A Christmas Carol?'", ["Charles Dickens", "2", "3", "4"], "Charles Dickens"),
    ("In 'Office Space', what is the name of the main character?", ["1", "Peter Gibbons", "3", "4"], "Peter Gibbons"),
    ("In 'Harry Potter', what is the name of Harry's pet owl?", ["1", "2", "Hedwig", "4"], "Hedwig"),
    ("In 'The Chronicles of Narnia', what is the name of the lion?", ["Aslan", "2", "3", "4"], "Aslan"),
    ("What fantasy series involves a dark lord known as Sauron?", ["1", "2", "3", "The Lord of the Rings"], "The Lord of the Rings"),
    ("What is the fictional sport played in 'Harry Potter'?", ["1", "2", "Quidditch", "4"], "Quidditch"),
    ("Which person has not held the title of Captain America in the MCU?", ["Steve Rogers", "John Walker", "Tony Stark", "Sam Wilson"], "Tony Stark"),
    ("Who cut Thanos' head off in 'Avengers: Endgame'?", ["1", "Thor", "3", "4"], "Thor"),
    ("In 'Avengers: Endgame', which infinity stone does Natasha sacrifice herself for?", ["Soul Stone", "2", "3", "4"], "Soul Stone"),
    ("In Thor: Ragnarok. who does Thor fight in the arena while stuck on Sakaar?", ["1", "The Hulk", "3", "4"], "The Hulk"),
    ("In 'Star Wars', what is the name of Han Solo's ship?", ["1", "2", "Millennium Falcon", "4"], "Millennium Falcon"),
    ("What was the first feature-length animated movie ever released?", ["Snow White and the Seven Dwarfs", "2", "3", "4"], "Snow White and the Seven Dwarfs"),
    ("What Star Wars movie was released in 1977?", ["1", "2", "3", "Star Wars: A New Hope"], "Star Wars: A New Hope"),
    ("In 'The Matrix', what color pill does Neo take?", ["1", "Red", "3", "4"], "Red"),
]

run_quiz(questions)
