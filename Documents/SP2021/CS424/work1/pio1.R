
#KHANG MACH 
# kmach6
# Project 1.
  

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
ultiliti<-read.table(file = "~/Documents/SP2021/CS424/annual_generation_state.csv", sep = ",", header = TRUE)

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
# when consier only US
ultiliti_us <-subset(ultiliti,ultiliti$state == "US-TOTAL" &source !="Total")

# map color 
map_colors= c("Coal"= "#F08080","Gas" ="#9370DB","Geothermal"="#D8BFD8","Hydro"="#20B2AA","Nuclear"="#B0C4DE","Solar"="#FFA07A","Wind"="#87CEEB","Petroleum"="#F4A460","Wood"="#32CD32" )

# when 
ce <-  group_by(ultiliti_us,year) %>% mutate(percent_weight = Wat / sum(Wat)) %>% group_by(year,source) %>%  summarise_at(vars(percent_weight),list(percent=sum))
ce_amount <- group_by(ultiliti_us,year,source) %>%  summarise_at(vars(Wat),list(my_sum=sum))

ce_percent <- ce 
ce_percent$percent <- round(ce$percent*100,2)

ulti_ins <- subset(ultiliti,state !="US-TOTAL" &source !="Total" )



inv_s <- subset(ce,year==2010)
inv_s <- inv_s$source

inv_ss <- c(inv_s,"All")  

inv_y <- subset(ce,source=="Coal")
inv_y <-inv_y$year
inv_state<-unique(ultiliti$state)

ulti_percent<-ulti_ins %>% group_by(year,state) %>% mutate(percent_source = Wat/sum(Wat)) %>% group_by(year,state,source) %>% summarise_at(vars(percent_source),list(my_sum=sum))
ulti_percent$my_sum <-ulti_percent$my_sum*100
View(ulti_percent)

ulti_inss <- subset(ultiliti, source !="Total" )
ulti_amount_wtotal <-  ulti_inss %>% group_by(year,state,source) %>% summarise_at(vars(Wat),list(my_sum=sum))
ulti_amount <- ulti_ins %>% group_by(year,state,source) %>% summarise_at(vars(Wat),list(my_sum=sum))

print(max(ulti_amount_wtotal$my_sum))
print(max(ulti_amount$my_sum))

state_key <- c(state.abb,c("US-TOTAL","DC"))
state_name <- c(state.name,c("US-TOTAL","Washington DC"))



ui <- dashboardPage(
  dashboardHeader(title ="test 1"),
  dashboardSidebar(disable = FALSE, collapsed = FALSE,                
                   sidebarMenu(
                     menuItem("Task1.1", tabName = "dashboard1", icon = icon("dashboard")),
                     menuItem("Task1.2", tabName = "dashboard2", icon = icon("dashboard")),
                     menuItem("Task2", tabName = "dashboard3", icon = icon("dashboard")),
                     menuItem("Task4", tabName = "dashboard4", icon = icon("dashboard")),
                    
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
  oneSource_amount <- reactive({subset(ce_amount,source == input$res )})
  oneSource_percent <-reactive({subset(ce_percent,source == input$res )})
  oneTable <- reactive({
    if(input$cent_raw =="Amount"){
      dcast(ce_amount,year~source)
    }
    else{
      dcast(ce_percent,year~source)
    }
    
  })
  
  
  
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
  
  firstBar<-reactive({
    ultib_inv <- ulti_inv_fun()
    abb<- setNames(state_key,state_name)[input$state] 
    if(input$res1 == "All"){
      subset(ultib_inv ,year==input$year & state == abb)
      
    }
    else{
      subset(ultib_inv ,year==input$year & state == abb & source==input$res1) 
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
      
      state_source
      
    }
    else{
      subset(state_source,source==input$res2) 
    }
    
  })
  
    
  my_map1<- reactive({
    ulti <- subset(ulti_ins, year == input$year3 & source  == input$source3)
    ulti<- ulti %>% group_by(state) %>% summarise_at(vars(Wat),list(my_sum=sum))
    
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
  
  
  base_scale <- reactive({
    ultib_inv1  <- firstBar()
    ultib_inv2  <- secondBar()
    max1 <-  ultib_inv1  %>% group_by(source) %>% summarise_at(vars(Wat),list(my_sum =sum))
    max2<-ultib_inv2   %>% group_by(source) %>% summarise_at(vars(Wat),list(my_sum =sum))
    View(max1)
    View(max2)
    if (max(max1$my_sum) >= max(max2$my_sum)){
      max(max1$my_sum)
    }
    else{
      max(max2$my_sum)
    }
  })
  
  
  
  
  
  output$stack1 <-renderPlot({
    ggplot(ultiliti_us,aes(x=year,y=Wat,fill =source)) + geom_bar(position="stack",stat="identity",na.rm=TRUE)+ labs(x="Years",y="MWatHours")+scale_fill_manual(values =map_colors)+
    theme(axis.title =element_text(size=15) ,legend.title =element_text(size= 12), legend.text =element_text(size= 10) ,legend.justification = c("right", "top"), legend.margin = margin(10, 0, 0, 6))  
  })
  output$stack2 <-renderPlot({
    ggplot(ultiliti_us,aes(x=year,y=Wat ,fill =source)) + geom_bar(position="fill",stat="identity",na.rm=TRUE) +scale_y_continuous(labels = scales::percent) + labs(x="Years",y="MWatHours")+scale_fill_manual(values =map_colors)+
      theme(axis.title =element_text(size=15) ,legend.title =element_text(size= 12), legend.text =element_text(size= 10) ,legend.justification = c("right", "top"), legend.margin = margin(10, 0, 0, 6)) 
    
  }) 
  
  output$plot1<- renderPlot({
    source_amount <- oneSource_amount() 
    
    ggplot(source_amount, aes(x=year,y=my_sum,colour=source)) +geom_line() + labs(x="Years",y="MWatHours")+ scale_color_manual(values =map_colors) +coord_cartesian(xlim = c(1990,2019)) +geom_point() 
    
  })
  output$plot2<- renderPlot({
    source_percent <- oneSource_percent() 
    ggplot(source_percent, aes(x=year,y=percent,colour=source)) +geom_line() + labs(x="Years",y="Percent%")+ scale_color_manual(values =map_colors) +ylim(0,100)+ xlim(1990,2019) + geom_point()
  })
  
  output$tab1 <- DT::renderDataTable(
    DT::datatable({ 
      table_display <- oneTable()
      as.data.frame(table_display)
    },options = list(searching = FALSE, pageLength = 6, lengthChange = FALSE, order = list(list(1, 'desc')))   
    ,rownames = FALSE 
    )
  )
  
  
  output$bar1<-renderPlot({
    ultib_in <- firstBar() 
    option_scale <-scale_option()
    max_wat <-0 
    if( option_scale ==TRUE ){
      max_wat <- base_scale()
    }
    else{
      if(input$state2 == "US-TOTAL" |input$state == "US-TOTAL"){
        max_wat<-max(ulti_amount_wtotal$my_sum)
      }
      else {
        max_wat  <- max(ulti_amount$my_sum)
      }
    }
    
    View(ultib_in)
    ggplot(ultib_in,aes(x=source, y=Wat,fill=source))+ geom_bar(stat= "identity")+scale_fill_manual(values=map_colors) + ylim(0,max_wat) 
    
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
    View(ultib_in2)
    ggplot(ultib_in2,aes(x=source, y=Wat,fill=source))+ geom_bar(stat= "identity")+scale_fill_manual(values=map_colors)  + ylim(0,max_wat)
    
  })
  
  
  
  
  output$map1 <-renderPlot({
    ulti <- my_map1()
     
    
    plot_usmap(data =ulti,values="my_sum",include= ulti$state,color = "red") + 
      scale_fill_continuous(low = "white", high = "red", name = "Wat amount", label = scales::comma,limits=c(0,max(ulti_amount$my_sum)))  
    
  })
  
  output$map2 <-renderPlot({
    ulti_per <- my_map2()
    
    plot_usmap(data =ulti_per,values="my_sum",include= ulti_per$state,color = "red") + 
      scale_fill_continuous(low = "white", high = "red", name = "% Wat with respect to state", label = scales::comma, limits=c(0,100)) 
    
  })
  
  
  
}

shinyApp(ui = ui, server = server)
