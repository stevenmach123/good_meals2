
#KHANG MACH 
# kmach6
# Project 1.
  
# I uncomment some View, but if want understand more my group by or filtering, please uncomment "#"
library(ggplot2)
library(lubridate)
library(reshape2)
library(dplyr)
library(shiny)
library(shinydashboard)
library(DT)
library(jpeg)
library(grid)
library(leaflet)
library(scales)
library(usmap)
library(maps)

#need modify open file directory
ultiliti<-read.table(file = "annual_generation_state.csv", sep = ",", header = TRUE)

names(ultiliti)[names(ultiliti) == "GENERATION..Megawatthours."] <- "Wat"

names(ultiliti)[names(ultiliti) == "TYPE.OF.PRODUCER"] <- "type" 

names(ultiliti)[names(ultiliti) == "ENERGY.SOURCE"] <- "source"
names(ultiliti)[names(ultiliti) == "YEAR"] <- "year"

names(ultiliti)[names(ultiliti) == "STATE"] <- "state"

ultiliti$source[ultiliti$source == "Hydroelectric Conventional"]  <- "Hydro"
ultiliti$source[ultiliti$source == "Solar Thermal and Photovoltaic"] <- "Solar"
ultiliti$source[ultiliti$source == "Natural Gas"] <- "Gas"
ultiliti$source[ultiliti$source == "Wood and Wood Derived Fuels"] <- "Wood"


ultiliti$Wat<-gsub(",","",ultiliti$Wat,fixed=TRUE)
ultiliti$Wat <-as.numeric(ultiliti$Wat)

# to upper case for US-TOTAL
ultiliti$state <-toupper(ultiliti$state)


ultiliti<-subset(ultiliti, state != "  " & Wat > -1 & source!="Other" & source!="Other Gases" & source != "Other Biomass" & source!="Pumped Storage")
# when consider US TOTAL focus
ultiliti_us <-subset(ultiliti,ultiliti$state == "US-TOTAL" &source !="Total")

# map color 
map_colors= c("Coal"= "#F08080","Gas" ="#9370DB","Geothermal"="#D8BFD8","Hydro"="#20B2AA","Nuclear"="#B0C4DE","Solar"="#FFA07A","Wind"="#87CEEB","Petroleum"="#F4A460","Wood"="#32CD32" )

# select group ultiliti_us with year, then compute percent of source in that particular year.
ce <-  group_by(ultiliti_us,year) %>% mutate(percent_weight = Wat / sum(Wat)) %>% group_by(year,source) %>%  summarise_at(vars(percent_weight),list(percent=sum))
# similar to ce, but group by year, then sum up 9 sources in that particular year
ce_amount <- group_by(ultiliti_us,year,source) %>%  summarise_at(vars(Wat),list(my_sum=sum))


ce_percent <- ce 
ce_percent$percent <- round(ce$percent*100,2)
# View(ce)
#View(ce_amount)


#this will use for task2 and 3 alot
ulti_ins <- subset(ultiliti,state !="US-TOTAL" &source !="Total" )

# find all  sources,
inv_s <- subset(ce,year==2010)
inv_s <- inv_s$source
inv_ss <- c(inv_s,"All")  
# find all years
inv_y <- subset(ce,source=="Coal")
inv_y <-inv_y$year
#find all state 
inv_state<-unique(ultiliti$state)

#group by year and state, and compute percent of 9 source for that state. 
ulti_percent<-ulti_ins %>% group_by(year,state) %>% mutate(percent_source = Wat/sum(Wat)) %>% group_by(year,state,source) %>% summarise_at(vars(percent_source),list(my_sum=sum))
ulti_percent$my_sum <-ulti_percent$my_sum*100
#View(ulti_percent)

#group by year and state, and compute amount of 9 source for that state. 
ulti_inss <- subset(ultiliti, source !="Total" )
ulti_amount_wtotal <-  ulti_inss %>% group_by(year,state,source) %>% summarise_at(vars(Wat),list(my_sum=sum))
ulti_amount <- ulti_ins %>% group_by(year,state,source) %>% summarise_at(vars(Wat),list(my_sum=sum))
#View(ulti_amount)


#print(max(ulti_amount_wtotal$my_sum))
#print(max(ulti_amount$my_sum))

#will use to map key to state name
state_key <- c(state.abb,c("US-TOTAL","DC"))
state_name <- c(state.name,c("US-TOTAL","Washington DC"))



ui <- dashboardPage(
  dashboardHeader(title ="Khang Mach Project 1"),
  dashboardSidebar(disable = FALSE, collapsed = FALSE,                
                   sidebarMenu(
                     menuItem("Task1.1", tabName = "dashboard1", icon = icon("dashboard")),
                     menuItem("Task1.2", tabName = "dashboard2", icon = icon("dashboard")),
                     menuItem("Task2", tabName = "dashboard3", icon = icon("dashboard")),
                     menuItem("Task3", tabName = "dashboard4", icon = icon("dashboard")),
                    
                     selectInput("res","Resources:",inv_s,selected= "Coal"),
                     selectInput("cent_raw","Mode for Raw Table",c("Amount","Percent"),selected="Amount"),
                    
                     selectInput('state',"select State (Bar1) Task2",state_name,selected="Texas"),
                     selectInput('year',"select Year (Bar1) Task2",inv_y,selected="1998"),
                     selectInput('state2',"select State (Bar2) Task2",state_name,selected="Illinois"),
                     selectInput('year2',"select Year (Bar2) Task2",inv_y,selected="1998"),
                     selectInput('year3',"select Year Task3",inv_y,selected="2000"),
                     selectInput('source3',"select Source Task3",inv_s,selected="Coal")
                   )),
  dashboardBody( 
    tabItems(
      tabItem(tabName ="dashboard1",
  
    fluidRow(
      column(width=12,box(title="stack of amount all source in total US across years",solidHeader = TRUE,width=12,status = "primary",plotOutput("stack1",height=236)))
      ,column(width=12,box(title="stack of percent all source in total US across years",solidHeader = TRUE,width=12,status = "primary",plotOutput("stack2",height=236)))
      
      
      #,column(width =12,box(title="my plot3",width=5,solidHeader = TRUE,status = "primary","hhaa",22)
      #       ,box(title="my plot4",solidHeader = TRUE,width=5,status = "primary","hhaa",22) )
      
      
     
    
    )
    ),
    tabItem(tabName="dashboard2",
            fluidRow(
              column(width =12,box(title="Amount of a source across year",solidHeader = TRUE,width=11,status = "primary",plotOutput("plot1",height=200))
                     ,box(title="Percent respect to all source in that year across years",solidHeader = TRUE,width=11,status = "primary",plotOutput("plot2",height = 200))
              ,column(width =12,box(title="Raw table(can be convert between % and amount by select input on menu)",width =12,solidHeader = TRUE,status = "primary",dataTableOutput("tab1",height=250) ))
              )
            )
    ), 
    tabItem(tabName="dashboard3",
      fluidRow(
         column(width=10.5,box(selectInput("res1","Resource Bar1",inv_ss,selected="All")),box(selectInput("scalemod","Scale option",c("Overall scale","Base scale"), selected ="Overall scale")))
        ,column(width=10.5,box(title="Bar amounts for resrouces in particular year and state",solidHeader = TRUE,width=12,status = "primary",plotOutput("bar1",height=240)))
        ,box(selectInput("res2","Resource Bar2",inv_ss,selected="All"))
        ,column(width=10.5,box(title="Bar percent  for resources in particular year and state",solidHeader = TRUE,width=12,status = "primary",plotOutput("bar2",height=240)))
        
     )      
    ),
    tabItem(tabName ="dashboard4",
      fluidRow(
        column(width=10.5,box(title="Map amounts across state in particular year and source ",solidHeader = TRUE,width=12,status = "primary",plotOutput("map1",height=350)))
        ,column(width=10.5,box(title="Map percent(with respect to that state all source) across state in particular year and source ",solidHeader = TRUE,width=12,status = "primary",plotOutput("map2",height=350)))
      ) 
    )
  )
    
    
  )
) 

server <- function(input,output){
  theme_set(theme_grey(base_size = 18)) 
  # for task1 line chart, notice, ce_amount, ce_percent introduced above
  oneSource_amount <- reactive({subset(ce_amount,source == input$res )})
  oneSource_percent <-reactive({subset(ce_percent,source == input$res )})
  # for task1 bar raw, unmelt by source
  oneTable <- reactive({
    if(input$cent_raw =="Amount"){
      dcast(ce_amount,year~source)
    }
    else{
      dcast(ce_percent,year~source)
    }
    
  })
  
  
  #task2, Base scale activate when either input resource 1 or 2 pick a particular source 
     #mean Base scale fail if 2 bar chart select "All" or/and scalemod == "Overall scale"
  scale_option <- reactive({
    if(input$scalemod== "Base scale" && (input$res1 != "All" || input$res2 != "All") ){
      TRUE
    }
    else{ 
      FALSE
    }
  })
  
  
  
  ulti_inv_fun<-reactive({
    if(input$state == "US-TOTAL" | input$state2 == "US-TOTAL"  ){
      ulti_inv  <- subset(ultiliti,source !="Total")
      ulti_inv 
    }
    else{
      ulti_inv  <- subset(ultiliti,source !="Total" & state != "US-TOTAL")
      ulti_inv
      
    }
  })
  
  #task2, first bar 
  firstBar<-reactive({
    ultib_inv <- ulti_inv_fun()
    abb<- setNames(state_key,state_name)[input$state] 
    state_source<-subset(ultib_inv,year==input$year & state == abb)
    # push some particular source not include in that  year,state
    for(i in inv_s){
      if( !(i %in% unique(state_source$source))){
        
        sub <- data.frame("year"=1,"state"="a","type"="a","source"=i,"Wat"=0)
        state_source<-rbind(state_source,sub)
      }
    }
    if(input$res1 == "All"){
      state_source #when filter data by select individual year,state, source is "All"
      
    }
    else{
      subset(state_source , source==input$res1) #when filter data by select individual year,state, source is one of 9 source
    }
    
  })
  
  
  
  secondBar<-reactive({
    ultib_inv2 <- ulti_inv_fun()
    abb<- setNames(state_key,state_name)[input$state2] 
    state_source<-subset(ultib_inv2 ,year==input$year2 & state == abb)
    for(i in inv_s){
      if( !(i %in% unique(state_source$source))){
        
        sub <- data.frame("year"=1,"state"="a","type"="a","source"=i,"Wat"=0)
        state_source<-rbind(state_source,sub)
      }
    }
    if(input$res2 == "All"){
      #View(state_source)
      state_source
      
    }
    else{
      subset(state_source,source==input$res2) 
    }
    
  })
  
  #task 3  
  # map for a source in particular year
  my_map1<- reactive({
    ulti <- subset(ulti_ins, year == input$year3 & source  == input$source3)
    # group by state, generate total of that source.
    ulti<- ulti %>% group_by(state) %>% summarise_at(vars(Wat),list(my_sum=sum))
    # with particular source(eg.geothermal) and year.Some states not include, so include them
    for( state in unique(ulti_ins$state)){
      if(!(state %in% ulti$state)){
        sub_ulti <- data.frame("state"=state,"my_sum" =0 )
        ulti<-rbind(ulti,sub_ulti)
      }
    }
    
    ulti
  }) 
  
  my_map2 <- reactive({
    ulti_per<-subset(ulti_percent,source == input$source3 & year==input$year3) 
   
    for( state in unique(ulti_ins$state)){
      if(!(state %in% ulti_per$state)){
        sub_ulti_per <- data.frame("state"=state,"my_sum" =0 )
        ulti_per<-rbind(ulti_per,sub_ulti_per)
        
      }
    }
    #View(ulti_per)
    ulti_per
  })
  
  #task2 when Base scale activate, it choose the highest bar of current 2 bar chart. compress the max scale to that high,
  #either the other chart(single bar/multiple bar"All") is low, be scale to new high(not the high of general scale anymore)
          #the other bar adjacement (same chart ), be scale to new high. (When higest at chart select "All")
  
  # NOTICE, on scale_option() above, if it true, then base_scale() activate
  base_scale <- reactive({
    ultib_inv1  <- firstBar() 
    ultib_inv2  <- secondBar()
    max1 <-  ultib_inv1  %>% group_by(source) %>% summarise_at(vars(Wat),list(my_sum =sum))
    max2<-ultib_inv2   %>% group_by(source) %>% summarise_at(vars(Wat),list(my_sum =sum))
    #View(max1)
    #View(max2)
    if (max(max1$my_sum) >= max(max2$my_sum)){
      max(max1$my_sum)
    }
    else{
      max(max2$my_sum)
    }
  })
  
  
  
  
  # task1
  output$stack1 <-renderPlot({
    ggplot(ultiliti_us,aes(x=year,y=Wat,fill =source)) + geom_bar(position="stack",stat="identity",na.rm=TRUE)+ labs(x="Years",y="MWatHours")+scale_fill_manual(values =map_colors)+
    theme(axis.title =element_text(size=15) ,legend.title =element_text(size= 12), legend.text =element_text(size= 10) ,legend.justification = c("right", "top"), legend.margin = margin(10, 0, 0, 6))  
  })
  output$stack2 <-renderPlot({
    ggplot(ultiliti_us,aes(x=year,y=Wat ,fill =source)) + geom_bar(position="fill",stat="identity",na.rm=TRUE) +scale_y_continuous(labels = scales::percent) + labs(x="Years",y="MWatHours")+scale_fill_manual(values =map_colors)+
      theme(axis.title =element_text(size=15) ,legend.title =element_text(size= 12), legend.text =element_text(size= 10) ,legend.justification = c("right", "top"), legend.margin = margin(10, 0, 0, 6)) 
    
  }) 
  #task1- line chart for amount/percent
  output$plot1<- renderPlot({
    source_amount <- oneSource_amount() 
    
    ggplot(source_amount, aes(x=year,y=my_sum,colour=source)) +geom_line() + labs(x="Years",y="MWatHours")+ scale_color_manual(values =map_colors) +coord_cartesian(xlim = c(1990,2019)) +geom_point() 
    
  })
  output$plot2<- renderPlot({
    source_percent <- oneSource_percent() 
    ggplot(source_percent, aes(x=year,y=percent,colour=source)) +geom_line() + labs(x="Years",y="Percent%")+ scale_color_manual(values =map_colors) +ylim(0,100)+ xlim(1990,2019) + geom_point()
  })
  #task1, output for table raw
  output$tab1 <- DT::renderDataTable(
    DT::datatable({ 
      table_display <- oneTable()
      as.data.frame(table_display)
    },options = list(searching = FALSE, pageLength = 6, lengthChange = FALSE, order = list(list(1, 'desc')))   
    ,rownames = FALSE 
    )
  )
  
  # task2 display bar1
  output$bar1<-renderPlot({
    ultib_in <- firstBar() 
    option_scale <-scale_option()
    max_wat <-0 
    if( option_scale ==TRUE ){
      max_wat <- base_scale() # Base scale activate
    }
    else{ # General scale activate 
      if(input$state2 == "US-TOTAL" |input$state == "US-TOTAL"){
        max_wat<-max(ulti_amount_wtotal$my_sum) # if either 2 input of state is US-TOTAL, max scale  base on total US a source( geo,gas,.etc) total in a year highest
      }
      else {
        max_wat  <- max(ulti_amount$my_sum) # if both input is some state, max can be considered on a state, in a year, have a source(geo,gas,etc.) total higest
      }
    }
    
    #View(ultib_in)
    ggplot(ultib_in,aes(x=source, y=Wat,fill=source))+ geom_bar(stat= "identity")+scale_fill_manual(values=map_colors) + ylim(0,max_wat)  #max_wat is what I try to achieve
    
  })
  output$bar2<-renderPlot({
    ultib_in2 <- secondBar() 
    option_scale <-scale_option()
    max_wat <-0 
    if( option_scale ==TRUE ){
      max_wat <- base_scale()
    }
    else{
      if(input$state2 == "US-TOTAL" | input$state == "US-TOTAL"){
        max_wat<-max(ulti_amount_wtotal$my_sum)
      }
      else {
        max_wat  <- max(ulti_amount$my_sum)
      }
    }
    #View(ultib_in2)
    ggplot(ultib_in2,aes(x=source, y=Wat,fill=source))+ geom_bar(stat= "identity")+scale_fill_manual(values=map_colors)  + ylim(0,max_wat)
    
  })
  
  
  
  #task3, display of map 
  output$map1 <-renderPlot({
    ulti <- my_map1()
     
    #View(ulti)
    plot_usmap(data =ulti,values="my_sum",include= ulti$state,color = "red") + 
      scale_fill_continuous(low = "white", high = "red", name = "Wat amount", label = scales::comma,limits=c(0,max(ulti_amount$my_sum)))  #limits set based max can be considered on a state, in a year, have a source(geo,gas,etc.) total higest
  
    
  })
  
  output$map2 <-renderPlot({
    ulti_per <- my_map2()
    #View(ulti_per)
    plot_usmap(data =ulti_per,values="my_sum",include= ulti_per$state,color = "red") + 
      scale_fill_continuous(low = "white", high = "red", name = "% Wat with respect to state", label = scales::comma, limits=c(0,100)) 
    
  })
  
  
  
}

shinyApp(ui = ui, server = server)
