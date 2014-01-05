(function(){
  //listening to the select event changes
  $('select').on('change', function(){
    
    //
    var csvData, arrData = [];
    $('#table').text("One Moment please..."); //Placeholder text
    
    //ajax function to fetch data from the php page-scrapper function
    $.ajax({
          type: "post",
          url: "/greet.php",
          data: {id: $('select').val()},
          success: function(datum) {
              return csvData = datum; // "something"
          }
      });
    
    //when the ajax succeeds this function runs
    $(document).ajaxSuccess(function(){
      /*
        d3 function to parse csv data. This is where I'm having problems. 
        Need to make this run properly. If we clear this one, the whole thing 
        will work perfectly. I think it's not running well because it parses the
        data one array at a time (instead of all the data at a go). I've several
        solutions in my head but I'd like to talk them out first
      */
      d3.csv.parse(csvData, function(dataset) {
        arrData.push(dataset);
        $('#table').empty(); //Clear the placeholder text in the table div
      });  
        //function for table creation
        function tabulate(data, columns) {
        
            var table = d3.select("#table").append("table")
              .style("border-collapse", "collapse")
              .style("border", "1px black solid"),
            thead = table.append("thead"),
            tbody = table.append("tbody");

            // append the header row
            thead.append("tr")
                .selectAll("th")
                .data(columnNames)
                .enter()
                .append("th")
                .style({
                  "border":"1px black solid",
                  "padding": "5px",
                  "background-color":"#72EDED",
                  "cursor":"pointer",
                  "font-size":"0.8em"
                })
                .text(function(column) { return column; });

            // create a row for each object in the data
            var rows = tbody.selectAll("tr")
                .data(data)
                .enter()
                .append("tr");

            // create a cell in each row for each column
            var cells = rows.selectAll("td")
                .data(function(row) {
                    
                    return columns.map(function(column) {
                        return {column: column, value: row[column]};
                    });
                })
                .enter()
                .append("td")
                .style("border", "1px black solid")
                .style({
                    "padding":"2px",
                    "font-size":"0.9em"
                })
                .text(function(d) { return d.value; });
            
            return table;
        }
        
        //columns to display. The names have to be the exact ones like the ones on the csv file
        var columns = ["Date", "HomeTeam", "AwayTeam", "FTHG", "FTAG", "FTR", "HTHG", "HTAG", "HTR", "Referee", "HS", "AS", "HST", "AST", "HF", "AF", "HC", "AC", "HY", "AY", "HR", "AR"];
        
        //Column names (can't use the above names as they are abbreviations)
        var columnNames = ["Date", "Home Team", "Away Team", "FT Home Goals", "FT Away Goals", "FT Result", "HT Home Goals", "HT Away Goals", "HT Result", "Referee", "Home Team Shots", "Away Team Shots", "Home Team Shots on Target", "Away Team Shots on Target", "Home Team Fouls", "Away Team Fouls", "Home Corners", "Away Corners", "Home Yellow Cards", "Away Yellow Cards", "Home Red Cards", "Away Red Cards"];
        
        //run the tabulate function
        tabulate(arrData, columns);
        
        //tablesorter & DataTable jQuery UI's for sorting the tables
        $("table").tablesorter()
          .dataTable( {
            "sScrollY": "400px",
            "bPaginate": false
          }); 
      
    });
    
    
  });
  $("table").tablesorter(); 
}());
