---
title: CPU-single-cycle项目使用指南
editLink: true
layout: doc
---

# {{ $frontmatter.title }}



## 一、项目介绍
该项目是一个RISC-V单周期处理器仿真、测试框架。你可以将你的单周期处理器接入到该框架中，用于验证自己的处理器实现是否正确，也可以在自己的处理器上运行一些简单的软件程序。


支持的指令集:RV32I(不含特权指令)

**项目主要目录如下**:
```
cpu-single-cycle
├── abstract-machine                 # 裸机运行时环境(目前忽略它)
├── IP                               # 处理器代码目录
│    ├── mycpu                          # 此目录用于接入你的单周期处理器
│    └── single-cycle                   # 项目内置的一个单周期处理器(verilog)
├── software-test                    # 测试处理器的软件程序
│    ├── benchmarks                     # benchmark测试程序
│    │   cpu-tests                      # 简单cpu测试程序
│    └── riscv-arch-test                # riscv官方测试cpu程序(待添加中)
├── simulator                        # 处理器模拟仿真框架
│    ├── include                        
│    │   nemu                           # 用于difftest的nemu动态链接库目录
│    │   src                            # 源代码目录
│    └── Makefile                       
├── Makefile                         
└── README.md

```
- **相关知识点**

    [CPU测试程序benchmark](https://en.wikipedia.org/wiki/Benchmark_(computing))

    [处理器模拟器](https://en.wikipedia.org/wiki/CPU_Sim)

    [裸机运行时环境](https://en.wikipedia.org/wiki/Runtime_system)

##  二、实验环境搭建

### 配置一览
- 操作系统： ubuntu 22.04(LTS), 非root账户
- 仿真工具： Verilator、GTKwave
- 编译工具： RISC-V
- 编程语言： Verilog HDL、C语言

### 安装ubuntu系统

[点击此处查看相关资料](install-ubuntu.md)
<br><br>
  
::: tip 开始之前—更换Ubuntu软件源

由于 Ubuntu 默认软件源在国内访问速度较慢，我们建议大家更换为国内的软件源，例如[北外镜像源](https://mirrors.bfsu.edu.cn/help/ubuntu/)。

在更换软件源后，请使用 sudo apt update 命令更新索引。
::: 




### 安装Verilator v5.008

使用[官方教程](https://verilator.org/guide/latest/install.html#git-quick-install)或者google搜索进行安装

### 安装GTKwave
```shell
$ sudo apt install gtkwave
```

### 安装库文件和编译工具
```shell
$ sudo apt-get install build-essential
$ sudo apt-get install libreadline-dev
$ sudo apt-get install llvm-dev
$ sudo apt-get install g++-riscv64-linux-gnu binutils-riscv64-linux-gnu
```

::: tip
目前仍有一部分工具, 暂未提供安装命令，后续会陆续添加支持。
::: 

### 

## 三、初次运行项目

### 1. 获取项目代码
``` shell
$ git clone git@github.com:akun0311/cpu-single-cycle.git
```

### 2. 设置环境变量
在你的`~/.bashrc`文件当中添加如下的环境变量，添加完成后，执行`source ~/.bashrc`命令

``` shell

export CPU_HOME=cpu-single-cycle目录的绝对路径 #复制后记得修改
export SIM_HOME=$CPU_HOME/simulator          #直接复制即可
export AM_HOME=$CPU_HOME/abstract-machine    #直接复制即可
export TEST_HOME=$CPU_HOME/software-test     #直接复制即可
```

### 3. 运行框架内置处理器
在终端中执行下面命令，尝试运行项目。
``` shell
$ cd $SIM_HOME
$ make run
```
### 4. 修复riscv32编译错误
第一次运行下面的命令，会出现一个编译错误，我们来修复它。
``` shell
$ cd $TEST_HOME/cpu-tests
$ make run ARCH=riscv32-npc ALL=dummy
```



如果遇到了以下错误:
<br>`/usr/riscv64-linux-gnu/include/bits/wordsize.h:28:3: error: #error "rv32i-based targets are not supported"`
<br>那么使用`sudo`权限修改`/usr/riscv64-linux-gnu/include/bits/wordsize.h`文件
``` vim
 #if __riscv_xlen == 64
 # define __WORDSIZE_TIME64_COMPAT32 1
 #else
    # error "rv32i-based targets are not supported" ----->将这一行注释掉
    # define __WORDSIZE_TIME64_COMPAT32 0           ----->在下面新增这一行
 #endif
```

<br>如果遇到了以下错误：
<br>`/usr/riscv64-linux-gnu/include/gnu/stubs.h:8:11: fatal error: gnu/stubs-ilp32.h: No such file or directory`
<br>那么使用`sudo`权限修改`/usr/riscv64-linux-gnu/include/gnu/stubs.h`文件
<br>将文件的`# include <gnu/stubs-ilp32.h>`这段代码注释掉
<br>


### 5. 运行测试程序
下面提供了多个可以运行测试程序的命令，选择其中一部分运行即可

运行cpu-tests目录下的测试集程序:
```
运行测试集程序的框架代码：
cd $TEST_HOME/cpu-tests
make run ARCH=riscv32-npc ALL=想运行的程序

示例1：
cd $TEST_HOME/cpu-tests
make run ARCH=riscv32-npc ALL=dummy

示例1：
cd $TEST_HOME/cpu-tests
make run ARCH=riscv32-npc
```

运行benchmarks目录下的测试集程序:
```
运行coremark测试:
cd $TEST_HOME/benchmarks/coremark
make run ARCH=riscv32-npc 

运行dhrystone测试：
cd $TEST_HOME/benchmarks/dhrystone
make run ARCH=riscv32-npc 

运行microbench测试1：
cd $TEST_HOME/benchmarks/microbench
make run ARCH=riscv32-npc mainargs=test

运行microbench测试2：
cd $TEST_HOME/benchmarks/microbench
make run ARCH=riscv32-npc mainargs=train

```




## 四、仿真框架介绍

### 1. 仿真框架对于处理器最顶层模块名称`TOP_Module_Name`的要求
为了支持所有的单周期处理器都可以接入该仿真、测试环境，我们预先设定了一个最顶层的仿真模块名称，即`TOP_Module_Name=CPU`也就是说处理器最顶层模块名称必须是`CPU`
::: warning 仿真框架只对TOP_Module_Name有此要求，对所有的verilog代码文件名，其他模块名称均没有任何要求。
:::

::: tip 自定义你的处理器TOP_Module_Name

项目通过`simulator/Makefile`的这段代码`TOPNAME :=CPU`指定了处理器最顶层模块名称`TOP_Module_Name`必须为`CPU`

通过修改`TOPNAME :=你写的模块名`, 可以指定处理器最顶层模块名称为`你写的模块名`

示例： 若`simulator/Makefile`中的`TOPNAME :=AAA`, 则处理器最顶层模块名称需要为`AAA`
::: 


## 五、将你的处理器接入仿真框架




# ---------------------下面待修改--------------------------------------

## 二. 运行模拟器和测试程序

2.运行模拟器——执行`make run`命令，运行模拟器

3.运行测试程序
(1)运行`cpu-test`测试程序, 复制下面的示例命令并执行
```
示例1

示例2


示例3
    cd $TEST_HOME/cpu-tests
    make run ARCH=riscv32-npc
```

(2)运行benchmarck测试程序
```
示例1——运行microbench的test测试集
    cd $TEST_HOME/benchmarks/microbench
    make run ARCH=riscv32-npc mainargs=test

示例2——运行microbench的train测试集
    cd $TEST_HOME/benchmarks/microbench
    make run ARCH=riscv32-npc mainargs=train

示例3——运行coremark
    cd $TEST_HOME/benchmarks/coremark
    make run ARCH=riscv32-npc
    #这个测试的分数可能不准

示例4——运行dhrystone测试
    cd $TEST_HOME/benchmarks/dhrystone
    make run ARCH=riscv32-npc
    #这个测试的分数也可能不准
```


### 仿真环境介绍
为了大家测试自己的单周期处理器实现是否正确，我们开发了一个用于测试单周期处理器的仿真框架。
我们只需要将自己的单周期处理器进行稍微改动，就可以接入仿真框架，进行一些测试。

### 1. **将你的处理器代码移动直`IP/mycpu目录`**:

    `IP/mycpu目录`是存放我们single-cycle-cpu的`verilog`代码的目录，将所有的处理器代码全部放入到mycpu目录里面

### 2. 将你的处理器代码接入仿真环境

mycpu目录内置了一个CPU.v, 其为内置的最顶层仿真模块, **我们的处理器要在该模块中进行实例化**

`CPU.v`模块内置以下四个信号

(1)输入信号`clk`——仿真环境提供的时钟信号

(2)输入信号`rst`——仿真环境提供的高电平复位信号

(3)输出信号`cpu_pc_for_simulator`——需要和你处理器的pc值绑定

(4)输出信号`regfile_for_simulator[31:0]`——需要和你处理器的寄存器信号绑定

对于输出信号来说，你需要从你的处理器代码里面引出对应的信号线，和对应的输出信号绑定
    以下是一些代码示例

    //CPU模块
    module CPU(
        input wire clk,
        input wire rst,

        output wire [31:0] cur_pc_for_simulator,
        output wire [31:0] regfile_for_simulator[31:0]
    );
        
    endmodule

    //clk的使用方法————我们只检测posedge clk
    always @(posedge clk) begin

    end


    //rst的使用方法
    //在rst为高位的时候，复位信号
    always @(posedge clk) begin
        if(rst) begin
            regfile[0] <= 32'd0;
        end
    end

    //绑定cpu_pc_for_simulator信号
    assign cpu_pc_for_simulator = 处理器当前的pc值

    //绑定regfile_for_simulator[31:0]信号
    你需要从寄存器文件引出几个额外的信号线，从而将寄存器信号和regfile_for_simulator信号绑定

3.修改取指模块
    
    你的处理器的取指模块要按照下面的逻辑进行取指，如果你的处理器有其他额外的信号，不会影响该逻辑过程。
    ```
    module fetch(

    );
    import "DPI-C" function int  dpi_mem_read 	(input int addr  , input int len);
    import "DPI-C" function void dpi_ebreak		(input int pc);

    assign 处理器取出的的指令 = dpi_mem_read(处理器取指的pc，, 4);

    always @(*) begin
        if(处理器取出的的指令 == 32'h00100073) begin
            dpi_ebreak(处理器取指的pc，);
        end
    end
    ```
4.修改访存模块

    你的处理器的访存模块需要按照下列的逻辑进行访存，如果你的处理器有其他额外的信号，不会影响该逻辑过程。

    ```
    module memory (
        input  wire                 clk,
        input  wire                 rst,
        input  wire                 xxx
    );
    import "DPI-C" function void dpi_mem_write(input int addr, input int data, int len);
    import "DPI-C" function int  dpi_mem_read (input int addr  , input int len);

    //从内存中读出数据
    wire [31:0] 读出来的数据;
    读出来的数据= dpi_mem_read(你要读取的内存地址, 4);

    //往内存中写入数据
    always @(posedge clk) begin
        if(如果需要写一个字节) begin
            dpi_mem_write(要写入的地址, 要写入的数据, 1);
        end
        else if(如果需要写两个字节) begin
            dpi_mem_write(要写入的地址, 要写入的数据, 2);		
        end
        else if(如果需要写4个字节) begin
            dpi_mem_write(要写入的地址, 要写入的数据, 4);				
        end
    end

    endmodule //moduleName
5.修改pc值

    `pc`初始值需要设置为0x80000000
    ```
    always @(posedge clk) begin
    if(rst) begin
        pc <= 32'h80000000;
    end

    ```


### 3. 使用我们自己的处理器

将`mycpu`目录的名字修改为`single-cycle-cpu`

### 4. 启动difftest

执行下面的命令，启动difftest，用于检测我们的处理器是否正确。

```
cd $SIM_HOME
make menuconfig
执行完后出现一个界面框，上下移动方向键，在[]Open Difftest这一栏里面，选中，然后选择save并退出。
```

### 3. 测试你的处理器
    运行cpu-tests目录下的测试程序

### 4. 对你的处理器进行benchmark跑分
    ！！！！！！一定要关闭Difftest之后，再进行benchmark跑分！！！！！！
    运行benchmark下面的测试集程序
    



### 其它事项
更多测试集程序正在添加中
