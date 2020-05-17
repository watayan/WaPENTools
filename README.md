# WaPENTools
WaPEN，PyPENのsample.jsやanswer.jsを生成する

## MakeSample
複数の.PENあるいは.PyPENファイルからsample.jsを生成する。

## MakeAnswer
複数の.QUIZファイルからanswer.jsを生成する。.QUIZファイルの書式は次の通り。
```
[TITLE]
三角形を表示する
[QUESTION]
整数を1つ受け取って，その段数の三角形を例のように「☆」で描きなさい。たとえば入力が3であれば
☆
☆☆
☆☆☆
のように表示する。入力される整数は正の整数であることを前提として良い。
[INPUT]
3
[OUTPUT]
☆
☆☆
☆☆☆
[INPUT]
5
[OUTPUT]
☆
☆☆
☆☆☆
☆☆☆☆
☆☆☆☆☆
[TIMEOUT]
100
```

* 入力は1行に1つ。複数の入力がある場合は複数行で記述する。
* TIMEOUTは制限時間（ミリ秒）であるが，省略可能。
