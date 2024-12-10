@echo off
setlocal ENABLEDELAYEDEXPANSION

call cls
REM set enviroment
for /f %%l in (.env) do (
    set %%l
)

if not !IS_BUILDED!==TRUE (
    call cd ..
    call npm ci
    call npm run release
    call cls
    call cd exec/
    for /f "" %%l in (.env) do (
        if "%%l"=="IS_BUILDED=FALSE" (
            echo IS_BUILDED=TRUE >> .temp
        ) else (
            echo %%l >> .temp
        )
    )
    call type .temp > .env
    call del .temp
    echo "build succeeded"
) else (
    echo "built before"
)

call cd ..
call npm run stop
call npm run clear
call npm run start
call npm run monitor
pause