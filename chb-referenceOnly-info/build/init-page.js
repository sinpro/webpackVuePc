const fs = require('fs');
const path = require('path');
const readline = require('readline');
const program = require('commander');
const copyFile = require('copy-template-dir');
const ffs = require('fs').promises;

program.option('-p, --path <string>', 'input path').parse(process.argv);
const chalk = require("chalk");

const paths = program.path;

// 目标路径
const dstPath = path.join(process.cwd(), `src/views/${paths}`);
const {
    templateMap,
    templateTips
} = require('../config/templateCont');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const updateConfJSON = title => {
    const arr = paths.split('/');
    // const confPath = path.join(process.cwd(), `src/views/${arr[0]}/README.md`);
    let template = `
    {
        // ${arr[1]}${safeCapitalize(arr[2])}功能
        path: '/${arr[0]}/${arr[1]}/${arr[2]}',
        name: '${arr[1]}${safeCapitalize(arr[2])}',
        component: !prodTypeEnv
            ? resolve =>
                require.ensure([], () =>
                    resolve(require('views/${arr[0]}/${arr[1]}/${arr[2]}'))
                )
            : () =>
                import(
            /* webpackChunkName: "${arr[0]}/${arr[1]}" */ 'views/${arr[0]}/${arr[1]}/${arr[2]}'
                ),
        meta: {
            menuCode: '${arr[1]}${safeCapitalize(arr[2])}',  // 开发时改成业务menuCode
            title: '${arr[1]}${safeCapitalize(arr[2])}',    // 开发时改成业务title
            navTitle: '${arr[1]}${safeCapitalize(arr[2])}', // 开发时如是菜单则保留且改成业务navTitle
        }
    },`
    // 判断文件是否存在
    try {
        fs.accessSync(`src/router/${arr[0]}/${arr[1]}.js`, fs.constants.F_OK);
        try {
            addAtPatternIfNotExists(
                `src/router/${arr[0]}/${arr[1]}.js`,
                '\n]',
                template
            );
        } catch (error) {
            console.error('追加文件时出错:', error);
        }
        
    } catch (err) {
        const confPath = path.join(process.cwd(), `src/router/${arr[0]}/${arr[1]}.js`);
        let contents = `export default [${template}\n]`
        fs.writeFile(confPath, contents, 'utf8', async function (err) {
            if (err) {
                return console.log(err);
            }else{
                await addAtPatternIfNotExists(`src/router/${arr[0]}/index.js`,'export default',`import ${arr[1]} from './${arr[1]}';`)
                await insertAfterText(`src/router/${arr[0]}/index.js`, `            ...${arr[1]},`, 'children: [');
            }
        });
    }
};

rl.question(`${chalk.greenBright('请选择需要生成的模板：')}${templateTips}`, index => {
    if(!templateMap[index]) {
        console.error(chalk.red('模板不存在,程序退出'));
        rl.close();
        return
    }
    // 模板路径
    const srcPath = path.join(process.cwd(), templateMap[index])
    rl.question(`${'input title:' +templateMap[index]}`,answer => {
        copyFile(
            srcPath,
            dstPath,
            r => {
                if (!r) {
                    updateConfJSON(answer);
                    console.log('page created success!');
                }
            }
        );
        rl.close();
    });

});

async function addAtPatternIfNotExists(filename, pattern, contentToAdd,type="before") {
    // 判断文件是否存在  
    try {
        let originalContent = '';
        try {
            originalContent = await ffs.readFile(filename, 'utf8');
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
            // 文件不存在
            await ffs.writeFile(filename, contentToAdd);
            return true;
        }
        // 检查内容是否已存在
        if (originalContent.includes(contentToAdd.trim())) {
            return false;
        }

        // 使用正则表达式匹配并插入
        const regex = new RegExp(pattern);
        if (regex.test(originalContent)) {
            const newContent = originalContent.replace(
                regex, 
                match =>type=='before'?(contentToAdd + '\n' +  match):(match + '\n' +  contentToAdd)
            );
            await ffs.writeFile(filename, newContent);
        } else {
            // 模式不匹配，添加到文件末尾
            await ffs.appendFile(filename, '\n' + contentToAdd, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }

        return true;
    } catch (err) {
        console.error('操作失败:', err);
        return false;
    }
    
}
async function insertAfterText(filePath, newContent, targetText) {
    try {
        let content = await ffs.readFile(filePath, 'utf8');
        
        // 查找目标文本位置并插入
        const index = content.indexOf(targetText);
        if (index !== -1) {
            const insertPosition = index + targetText.length;
            const newContentWithText = content.slice(0, insertPosition) + 
                                     '\n' + newContent + 
                                     content.slice(insertPosition);
            
            await ffs.writeFile(filePath, newContentWithText, 'utf8');
        } else {
            console.error('未找到目标文本');
        }
    } catch (error) {
        console.error('操作失败:', error);
    }
}
function safeCapitalize(str) {
    if (typeof str !== 'string') {
        throw new Error('输入必须是一个字符串');
    }
    if (str.length === 0) return '';
    
    // 处理只有一个字符的情况
    if (str.length === 1) return str.toUpperCase();
    
    return str.charAt(0).toUpperCase() + str.slice(1);
}