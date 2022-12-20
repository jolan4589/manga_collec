> **Warning** : *This doc as been wrote for [GitLab 15.1.1](https://gitlab.com/gitlab-org/gitlab-foss/-/tags/v15.1.1).*

# Table doc
### _Documentation about database tables_

_____________
_____________
## Table of content
[ ] - [**Home doc**](../../../README.md#discord-doc)
- [Collections](#collections)
	* [exemple](#collections-tuple-exemple)
- [Series](#series)
	* [exemple](#series-tuple-exemple)
- [UserSeries](#userseries)
	* [exemple](#userseries-tuple-exemple)
_____________

## Collections

| attribute | type | description | key
| :--- | ---: | :--- | ---: |
| owner | STRING | Discord.userId of the owner | primary |
| name | STRING | Name of the owner | primary |
| total_books | INTEGER | Amont of books in this.owner collection | - |
____________

### ___Collections Tuple exemple :___

* Collectionns("1", "Toto", 12)
* Collection("134", "Bil", 0)

## Series

| attribute | type | description | key
| :--- | ---: | :--- | ---: |
| title | STRING | Title of the book| primary | primary |
| author | STRING | Name of the author that wrote the book | - |
| editor | STRING | Name of the editor that published this.title | - |
| ended | BOOLEAN | True if the serie's ended | - |
| volume_number | INTEGER | Total book number of this.title serie | - |

### ___Series Tuple exemple :___

* Series("Alice in Wonderland", "One among all", true, 5)
* Series("One Piece", "Glénat", false, 104)
__________

## UserSeries

| attribute | type | description | key
| :--- | ---: | :--- | ---: |
| title | STRING | Title of the serie | primary reference(Series.title) |
| owner | STRING | Discord.userId of the owner | primary reference(Series.title) |
| volume_list | STRING | String containing owned volumes : "\[x-y\]" for ranges, "x,y" for interupted sequences | - |

### ___UserSeries Tuple exemple :___

* UserSeries("Alice in Wonderland", "Toto", "\[1-5\]")
* UserSeries("One Piece", "Toto", "\[1-5\],7,[9-100],102,104")