//
//  VGViewController.m
//  webChecker
//
//  Created by JiangHuifu on 14-9-20.
//  Copyright (c) 2014年 veger. All rights reserved.
//

#import "VGViewController.h"

@interface VGViewController ()
@property(nonatomic,retain) UIWebView* webView;
@end

@implementation VGViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    _webView = [[UIWebView alloc] initWithFrame:self.view.bounds];
    [self.view addSubview:_webView];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    NSString *filePath = [[NSBundle mainBundle]pathForResource:@"tiaoqi" ofType:@"html"];
//    NSString *filePath = [[NSBundle mainBundle]pathForResource:@"myTest" ofType:@"html"];
    NSString *htmlString = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
    [_webView loadHTMLString:htmlString baseURL:[NSURL URLWithString:filePath]];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
