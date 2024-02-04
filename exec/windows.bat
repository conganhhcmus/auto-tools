@echo off
setlocal ENABLEDELAYEDEXPANSION

cls
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
    call type .env > .temp
    call break > .env
    for /f "" %%l in (.temp) do (
        if "%%l"=="IS_BUILDED=FALSE" (
            echo IS_BUILDED=TRUE >> .env
        ) else (
            echo %%l >> .env
        )
    )
    call del .temp
    echo "build finished"
) else (
    echo "skip build"
)
cd
call npm run all-server
popd